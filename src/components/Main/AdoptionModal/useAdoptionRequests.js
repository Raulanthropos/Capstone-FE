import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createAdoptionRequest, getMyAdoptionRequests } from "../../../api/adoptions";
import { logoutUser } from "../../../redux/actions/profileAction";
import { notifyError } from "../../../ui/feedback";
import { useInbox } from "../../../inbox/InboxProvider";

export default function useAdoptionRequests() {
  const { revision } = useInbox();
  const accessToken = useSelector((state) => state.loadedProfile.accessToken);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [requestsByDog, setRequestsByDog] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const mounted = useRef(false);
  const loadController = useRef(null);
  const submitController = useRef(null);
  const submissionInProgress = useRef(false);

  const expireSession = useCallback(() => {
    dispatch(logoutUser());
    navigate("/login", {
      replace: true,
      state: { message: "Your session has expired. Please log in again." },
    });
  }, [dispatch, navigate]);

  const refresh = useCallback(async () => {
    loadController.current?.abort();
    const controller = new AbortController();
    loadController.current = controller;
    setLoading(true);
    setError("");
    try {
      const requests = await getMyAdoptionRequests(accessToken, controller.signal);
      if (mounted.current && !controller.signal.aborted) {
        setRequestsByDog(Object.fromEntries(requests.map((request) => [request.dogId, request])));
      }
    } catch (error) {
      if (mounted.current && !controller.signal.aborted) {
        if (error.status === 401) expireSession();
        else setError(error.message);
      }
    } finally {
      if (mounted.current && !controller.signal.aborted) setLoading(false);
    }
  }, [accessToken, expireSession]);

  useEffect(() => {
    mounted.current = true;
    refresh();
    return () => {
      mounted.current = false;
      loadController.current?.abort();
      submitController.current?.abort();
    };
  }, [refresh]);

  useEffect(() => { if (revision > 0) refresh(); }, [revision, refresh]);

  const submit = async (dogId) => {
    if (submissionInProgress.current || loading || error || requestsByDog[dogId]) return null;
    submissionInProgress.current = true;
    setSubmitting(true);
    const controller = new AbortController();
    submitController.current = controller;
    try {
      const request = await createAdoptionRequest(dogId, accessToken, controller.signal);
      if (!mounted.current || controller.signal.aborted) return null;
      setRequestsByDog((previous) => ({ ...previous, [dogId]: request }));
      return request;
    } catch (error) {
      if (!mounted.current || controller.signal.aborted) return null;
      if (error.status === 401) {
        notifyError("Your session has expired. Please log in again.");
        expireSession();
        return null;
      }
      // A second tab or a lost success response may have already created it.
      // Read its real status; 409 can also mean the dog is no longer available.
      if (error.status === 409) await refresh();
      if (!mounted.current || controller.signal.aborted) return null;
      throw error;
    } finally {
      submissionInProgress.current = false;
      if (mounted.current && !controller.signal.aborted) setSubmitting(false);
    }
  };

  return { requestsByDog, loading, error, submitting, refresh, submit };
}
