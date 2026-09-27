import { Alert, Modal, Button, Spinner } from "react-bootstrap";

const AdoptionModal = ({ dog, onClose, onSubmit, submitting, canSubmit, error }) => (
  <Modal show onHide={onClose} backdrop={submitting ? "static" : true}
    keyboard={!submitting} aria-labelledby="adoption-modal-title">
    <Modal.Header>
      <Modal.Title id="adoption-modal-title">Adoption request for {dog.name}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <p>Would you like to submit an adoption request for {dog.name}?</p>
      <p>Your request will be pending review. Submitting it does not confirm an adoption.</p>
      {error && <Alert variant="danger">{error}</Alert>}
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onClose} disabled={submitting}>Cancel</Button>
      <Button variant="success" onClick={onSubmit} disabled={submitting || !canSubmit}>
        {submitting && <Spinner as="span" animation="border" size="sm" aria-hidden="true" className="mr-2" />}
        {submitting ? "Submitting..." : "Submit adoption request"}
      </Button>
    </Modal.Footer>
  </Modal>
);

export default AdoptionModal;
