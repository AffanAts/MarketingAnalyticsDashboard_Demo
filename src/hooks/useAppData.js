import { useState, useCallback } from 'react';
import initialInquiries from '../data/inquiries.json';
import initialWebsiteMetrics from '../data/websiteMetrics.json';
import initialSettings from '../data/settings.json';
import initialAuditLogs from '../data/auditLogs.json';
import initialUsers from '../data/users.json';

const CURRENT_USER = { id: 1, username: 'superadmin', role: 'super_admin' };

let _idCounter = 100;
function genId(prefix = 'inq') {
  return `${prefix}-${Date.now()}-${++_idCounter}`;
}

export function useAppData() {
  const [inquiries, setInquiries] = useState(initialInquiries);
  const [websiteMetrics, setWebsiteMetrics] = useState(initialWebsiteMetrics);
  const [thresholds, setThresholds] = useState(initialSettings);
  const [auditLogs, setAuditLogs] = useState(initialAuditLogs);
  const [users, setUsers] = useState(initialUsers);
  const [deletedInquiries, setDeletedInquiries] = useState([]);

  function addLog(action, entityType, note) {
    const entry = {
      id: genId('log'),
      timestamp: new Date().toISOString(),
      username: CURRENT_USER.username,
      action,
      entityType,
      note,
    };
    setAuditLogs((prev) => [entry, ...prev]);
  }

  // ---- INQUIRY CRUD ----
  const addInquiry = useCallback((payload) => {
    const now = new Date().toISOString().slice(0, 10);
    const newInq = {
      id: genId('inq'),
      ...payload,
      currentStage: payload.currentStage || 'interest',
      isDropped: false,
      droppedAtStage: null,
      createdAt: now,
      updatedAt: now,
      followUps: payload.followUps || [
        { number: 1, scheduledDate: null, done: false, doneDate: null },
        { number: 2, scheduledDate: null, done: false, doneDate: null },
        { number: 3, scheduledDate: null, done: false, doneDate: null },
      ],
    };
    setInquiries((prev) => [newInq, ...prev]);
    addLog('CREATE', 'INQUIRY', `Menambah inquiry ${newInq.companyName}`);
    return newInq;
  }, []);

  const updateInquiry = useCallback((id, payload) => {
    setInquiries((prev) =>
      prev.map((inq) =>
        inq.id === id ? { ...inq, ...payload, updatedAt: new Date().toISOString().slice(0, 10) } : inq
      )
    );
    addLog('UPDATE', 'INQUIRY', `Update inquiry ${id}`);
  }, []);

  const deleteInquiry = useCallback((id) => {
    setInquiries((prev) => {
      const found = prev.find((inq) => inq.id === id);
      if (found) setDeletedInquiries((d) => [{ ...found, deletedAt: new Date().toISOString() }, ...d]);
      return prev.filter((inq) => inq.id !== id);
    });
    addLog('DELETE', 'INQUIRY', `Hapus inquiry ${id}`);
  }, []);

  const restoreInquiry = useCallback((id) => {
    setDeletedInquiries((prev) => {
      const found = prev.find((inq) => inq.id === id);
      if (found) {
        const { deletedAt, ...rest } = found;
        setInquiries((inqs) => [rest, ...inqs]);
      }
      return prev.filter((inq) => inq.id !== id);
    });
    addLog('RESTORE', 'INQUIRY', `Restore inquiry ${id}`);
  }, []);

  const advanceStage = useCallback((id) => {
    const STAGE_ORDER = ['interest', 'consideration', 'purchase', 'retention', 'advocacy'];
    setInquiries((prev) =>
      prev.map((inq) => {
        if (inq.id !== id || inq.isDropped) return inq;
        const currentIdx = STAGE_ORDER.indexOf(inq.currentStage);
        if (currentIdx === -1 || currentIdx >= STAGE_ORDER.length - 1) return inq;
        const nextStage = STAGE_ORDER[currentIdx + 1];
        addLog('ADVANCE_STAGE', 'INQUIRY', `${inq.companyName} naik ke ${nextStage}`);
        return { ...inq, currentStage: nextStage, updatedAt: new Date().toISOString().slice(0, 10) };
      })
    );
  }, []);

  const dropInquiry = useCallback((id) => {
    setInquiries((prev) =>
      prev.map((inq) => {
        if (inq.id !== id) return inq;
        addLog('UPDATE', 'INQUIRY', `Drop inquiry ${inq.companyName}`);
        return { ...inq, isDropped: true, droppedAtStage: inq.currentStage, updatedAt: new Date().toISOString().slice(0, 10) };
      })
    );
  }, []);

  const undropInquiry = useCallback((id) => {
    setInquiries((prev) =>
      prev.map((inq) => {
        if (inq.id !== id) return inq;
        return { ...inq, isDropped: false, droppedAtStage: null, updatedAt: new Date().toISOString().slice(0, 10) };
      })
    );
  }, []);

  const toggleFollowUp = useCallback((inqId, fuIdx) => {
    setInquiries((prev) =>
      prev.map((inq) => {
        if (inq.id !== inqId) return inq;
        const followUps = (inq.followUps || []).map((fu, i) => {
          if (i !== fuIdx) return fu;
          return fu.done
            ? { ...fu, done: false, doneDate: null }
            : { ...fu, done: true, doneDate: new Date().toISOString().slice(0, 10) };
        });
        return { ...inq, followUps };
      })
    );
  }, []);

  // ---- WEBSITE METRICS CRUD ----
  const addWebsiteMetric = useCallback((payload) => {
    const newMetric = { id: genId('wm'), ...payload };
    setWebsiteMetrics((prev) => [...prev, newMetric].sort((a, b) => a.date.localeCompare(b.date)));
    addLog('CREATE', 'WEBSITE_METRIC', `Tambah data DA/PA ${payload.date}`);
  }, []);

  const updateWebsiteMetric = useCallback((id, payload) => {
    setWebsiteMetrics((prev) => prev.map((m) => (m.id === id ? { ...m, ...payload } : m)));
    addLog('UPDATE', 'WEBSITE_METRIC', `Update data DA/PA ${id}`);
  }, []);

  const deleteWebsiteMetric = useCallback((id) => {
    setWebsiteMetrics((prev) => prev.filter((m) => m.id !== id));
    addLog('DELETE', 'WEBSITE_METRIC', `Hapus data DA/PA ${id}`);
  }, []);

  // ---- SETTINGS ----
  const updateThresholds = useCallback((newThresholds) => {
    setThresholds(newThresholds);
    addLog('UPDATE', null, 'Update threshold funnel');
  }, []);

  // ---- USER MANAGEMENT ----
  const addUser = useCallback((payload) => {
    const newUser = { id: Date.now(), ...payload, status: 'pending_approval', createdAt: new Date().toISOString().slice(0, 10) };
    setUsers((prev) => [...prev, newUser]);
  }, []);

  const updateUser = useCallback((id, payload) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...payload } : u)));
  }, []);

  const deleteUser = useCallback((id) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    addLog('DELETE', 'USER', `Hapus user ${id}`);
  }, []);

  const approveUser = useCallback((id) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status: 'approved' } : u)));
    addLog('APPROVE_USER', 'USER', `Approve user ${id}`);
  }, []);

  const rejectUser = useCallback((id) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    addLog('UPDATE', 'USER', `Reject/hapus user ${id}`);
  }, []);

  const updateUserRole = useCallback((id, role) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
    addLog('UPDATE', 'USER', `Update role user ${id} ke ${role}`);
  }, []);

  return {
    currentUser: CURRENT_USER,
    inquiries,
    websiteMetrics,
    thresholds,
    auditLogs,
    users,
    deletedInquiries,
    awarenessMetrics: { totalReach: 125000 },
    // inquiry
    addInquiry,
    updateInquiry,
    deleteInquiry,
    restoreInquiry,
    advanceStage,
    dropInquiry,
    undropInquiry,
    toggleFollowUp,
    // website
    addWebsiteMetric,
    updateWebsiteMetric,
    deleteWebsiteMetric,
    // settings
    updateThresholds,
    // users
    addUser,
    updateUser,
    deleteUser,
    approveUser,
    rejectUser,
    updateUserRole,
  };
}
