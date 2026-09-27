import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Badge, Button, Card, Col, Container, Form, Modal, Row, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import { getAdoptionReviewPage, reviewAdoptionRequest } from "../../../api/adoptions";
import { logoutUser } from "../../../redux/actions/profileAction";

const labels = { pending: "Pending review", approved: "Approved", rejected: "Declined" };
const pageSize = 20;
const fullName = (user) => user.name + " " + user.surname;

function ReviewPanel({ accessToken, onSessionExpired }) {
  const [page, setPage] = useState({ status: "pending", offset: 0 });
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [reload, setReload] = useState(0);
  const [selection, setSelection] = useState(null);
  const [actionError, setActionError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState("");
  const mounted = useRef(false);
  const actionController = useRef(null);
  const inFlight = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      actionController.current?.abort();
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setLoadError("");
    setItems([]);
    const load = async () => {
      try {
        const result = await getAdoptionReviewPage(accessToken, page, controller.signal);
        if (controller.signal.aborted) return;
        if (page.offset > 0 && page.offset >= result.total) {
          setPage((current) => ({
            ...current, offset: Math.max(0, Math.floor((result.total - 1) / pageSize) * pageSize),
          }));
          return;
        }
        setItems(result.items);
        setTotal(result.total);
      } catch (error) {
        if (controller.signal.aborted) return;
        if (error.status === 401) onSessionExpired();
        else setLoadError(error.message);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    load();
    return () => controller.abort();
  }, [accessToken, page, reload, onSessionExpired]);

  const choose = (request, status) => {
    setSelection({ request, status });
    setActionError("");
    setNotice("");
  };
  const close = () => {
    if (!inFlight.current) {
      setSelection(null);
      setActionError("");
    }
  };
  const currentRequest = selection && items.find((item) => item._id === selection.request._id);
  const canReview = currentRequest?.status === "pending" && !loading && !loadError &&
    !(selection?.status === "approved" && currentRequest.dog.isAdopted);

  const confirm = async () => {
    if (!selection || !canReview || inFlight.current) return;
    inFlight.current = true;
    setSubmitting(true);
    setActionError("");
    const controller = new AbortController();
    actionController.current = controller;
    try {
      const result = await reviewAdoptionRequest(
        selection.request._id, selection.status, accessToken, controller.signal
      );
      if (!mounted.current || controller.signal.aborted) return;
      const message = result.status === "approved"
        ? "Approved the adoption of " + selection.request.dog.name + "."
        : "Declined the request for " + selection.request.dog.name + ".";
      setNotice(message + (result.closedRequests > 0
        ? " Other pending requests for this dog were also declined." : ""));
      setSelection(null);
      setReload((value) => value + 1);
    } catch (error) {
      if (!mounted.current || controller.signal.aborted) return;
      if (error.status === 401) {
        onSessionExpired();
        return;
      }
      setActionError(error.message);
      if ([403, 404, 409].includes(error.status)) setReload((value) => value + 1);
    } finally {
      inFlight.current = false;
      if (mounted.current && !controller.signal.aborted) setSubmitting(false);
    }
  };

  return (
    <Container className="py-4">
      <h1>Adoption requests</h1>
      <p>Review the applicant's profile and choose whether to approve or decline their request.</p>
      <Button as={Link} to="/users/me" variant="outline-secondary" className="mb-3">Back to profile</Button>
      <Form.Group controlId="review-status">
        <Form.Label>Request status</Form.Label>
        <Form.Control as="select" value={page.status} disabled={submitting}
          onChange={(event) => { setPage({ status: event.target.value, offset: 0 }); setNotice(""); }}>
          <option value="pending">Pending review</option>
          <option value="approved">Approved</option>
          <option value="rejected">Declined</option>
          <option value="all">All requests</option>
        </Form.Control>
      </Form.Group>
      <Button variant="outline-primary" className="mb-3" disabled={loading || submitting}
        onClick={() => setReload((value) => value + 1)}>
        {loadError ? "Retry loading requests" : "Refresh requests"}
      </Button>
      {notice && <Alert variant="success" role="status">{notice}</Alert>}
      {loadError && <Alert variant="danger">{loadError}</Alert>}
      {loading && <p role="status"><Spinner as="span" animation="border" size="sm" aria-hidden="true" /> Loading adoption requests...</p>}
      {!loading && !loadError && items.length === 0 && <p>No requests match this status.</p>}
      {items.map((request) => (
        <Card as="article" aria-label={request.dog.name + " - " + fullName(request.user)}
          key={request._id} className="mb-3">
          <Card.Body>
            <Card.Title as="h2">{request.dog.name}</Card.Title>
            <Badge variant={request.status === "pending" ? "warning" : request.status === "approved" ? "success" : "secondary"}>
              {labels[request.status] || request.status}
            </Badge>
            <Row className="mt-3">
              <Col md={6}>
                <h3 className="h5">Applicant</h3>
                <p><strong>{fullName(request.user)}</strong><br />{request.user.email}<br />Age: {request.user.age}</p>
                <p style={{ whiteSpace: "pre-wrap" }}>{request.user.description}</p>
              </Col>
              <Col md={6}>
                <h3 className="h5">Dog</h3>
                <p>{request.dog.breed} · {request.dog.gender} · {request.dog.age} years · {request.dog.weight} kg</p>
                {request.dog.location && <p>{request.dog.location}</p>}
                <p style={{ whiteSpace: "pre-wrap" }}>{request.dog.description}</p>
              </Col>
            </Row>
            <p className="text-muted">Submitted: {new Date(request.createdAt).toLocaleString()}</p>
            {request.reviewedAt && <p className="text-muted">Reviewed: {new Date(request.reviewedAt).toLocaleString()}</p>}
            {request.status === "pending" && <>
              {request.dog.isAdopted && <p>This dog has already been adopted. This pending request can be declined.</p>}
              <Button variant="success" className="mr-2" disabled={submitting || loading || request.dog.isAdopted}
                onClick={() => choose(request, "approved")}>Approve request</Button>
              <Button variant="outline-danger" disabled={submitting || loading}
                onClick={() => choose(request, "rejected")}>Decline request</Button>
            </>}
          </Card.Body>
        </Card>
      ))}
      {!loading && !loadError && total > 0 && <div className="d-flex align-items-center justify-content-between">
        <Button variant="outline-secondary" disabled={page.offset === 0 || submitting}
          onClick={() => setPage((current) => ({ ...current, offset: current.offset - pageSize }))}>Previous page</Button>
        <span>{page.offset + 1}-{Math.min(page.offset + items.length, total)} of {total}</span>
        <Button variant="outline-secondary" disabled={page.offset + pageSize >= total || submitting}
          onClick={() => setPage((current) => ({ ...current, offset: current.offset + pageSize }))}>Next page</Button>
      </div>}
      {selection && <Modal show onHide={close} backdrop={submitting ? "static" : true}
        keyboard={!submitting} aria-labelledby="review-confirm-title">
        <Modal.Header>
          <Modal.Title id="review-confirm-title">
            {selection.status === "approved" ? "Approve adoption request" : "Decline adoption request"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{fullName(selection.request.user)} has requested to adopt {selection.request.dog.name}.</p>
          <p>{selection.status === "approved"
            ? "Approval will mark this dog as adopted and decline all other pending requests for the same dog."
            : "Declining affects this request only. The dog remains available if it has not already been adopted."}</p>
          {actionError && <Alert variant="danger">{actionError}</Alert>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={close} disabled={submitting}>Cancel</Button>
          <Button variant={selection.status === "approved" ? "success" : "danger"}
            disabled={submitting || !canReview} onClick={confirm}>
            {submitting ? "Saving decision..." : selection.status === "approved" ? "Confirm approval" : "Confirm decline"}
          </Button>
        </Modal.Footer>
      </Modal>}
    </Container>
  );
}

export default function AdminAdoptions() {
  const { isAuthenticated, currentUser, accessToken } = useSelector((state) => state.loadedProfile);
  const dispatch = useDispatch();
  const expireSession = useCallback(() => dispatch(logoutUser()), [dispatch]);
  if (!isAuthenticated || !currentUser) return <Navigate to="/login" replace
    state={{ message: "Authentication required. Please log in again." }} />;
  if (currentUser.role !== "admin") {
    return <Container className="py-4"><Alert variant="danger">Administrator access required.</Alert>
      <Button as={Link} to="/main">Back to dogs</Button></Container>;
  }
  return <ReviewPanel key={accessToken} accessToken={accessToken} onSessionExpired={expireSession} />;
}
