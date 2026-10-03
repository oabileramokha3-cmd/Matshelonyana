import React, { useState, useEffect } from 'react';
import { 
  Role, 
  Job, 
  DriverBid, 
  ChatMessage, 
  TransactionRecord, 
  NotificationItem, 
  OfflineSyncQueueItem,
  DriverApplication,
  JobStatus 
} from './types';
import { 
  INITIAL_JOBS, 
  INITIAL_TRANSACTIONS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_CHATS,
  INITIAL_DRIVER_APPLICATIONS,
  AVAILABLE_DRIVERS 
} from './data/mockData';
import { generateSHA256Hash } from './utils/crypto';
import { Navbar } from './components/Navbar';
import { CustomerView } from './components/customer/CustomerView';
import { DriverView } from './components/driver/DriverView';
import { AppOwnerPortal } from './components/owner/AppOwnerPortal';
import { AnalyticsDashboard } from './components/admin/AnalyticsDashboard';
import { MapView } from './components/MapView';
import { NewHaulModal } from './components/customer/NewHaulModal';
import { DriverRegistrationModal } from './components/driver/DriverRegistrationModal';
import { NotificationDrawer } from './components/common/NotificationDrawer';
import { OfflineSyncBanner } from './components/common/OfflineSyncBanner';
import { ShieldCheck, Truck, Lock, Smartphone, RefreshCw, FileText } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  const [currentRole, setCurrentRole] = useState<Role>('owner');
  const [activeTab, setActiveTab] = useState<string>('hauls');
  
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const [activeJobId, setActiveJobId] = useState<string>(INITIAL_JOBS[0].id);
  
  const [transactions, setTransactions] = useState<TransactionRecord[]>(INITIAL_TRANSACTIONS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(INITIAL_CHATS);
  const [driverApplications, setDriverApplications] = useState<DriverApplication[]>(INITIAL_DRIVER_APPLICATIONS);
  
  // Offline sync states
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [offlineQueue, setOfflineQueue] = useState<OfflineSyncQueueItem[]>([]);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Modals & Drawers
  const [showNewHaulModal, setShowNewHaulModal] = useState<boolean>(false);
  const [showDriverRegisterModal, setShowDriverRegisterModal] = useState<boolean>(false);
  const [showNotificationDrawer, setShowNotificationDrawer] = useState<boolean>(false);

  const activeJob = jobs.find((j) => j.id === activeJobId) || jobs[0];

  // Driver registers with Omang ID & Licence
  const handleRegisterDriver = (application: DriverApplication) => {
    if (!isOnline) {
      setOfflineQueue((prev) => [
        ...prev,
        {
          id: `queue-app-${Date.now()}`,
          action: 'SUBMIT_DRIVER_APPLICATION',
          payload: application,
          queuedAt: new Date().toLocaleTimeString(),
        },
      ]);
    }

    setDriverApplications((prev) => [application, ...prev]);

    // Push notification for App Owner
    const ownerNotif: NotificationItem = {
      id: `notif-app-${Date.now()}`,
      type: 'push',
      title: `New Driver KYC Registration: ${application.fullName}`,
      message: `${application.fullName} uploaded Omang ID (${application.omangNumber}) & ${application.licenceClass} for ${application.truckPlate}. Action required in App Owner Portal.`,
      timestamp: 'Just now',
      urgent: true,
      read: false,
    };

    // SMS sent to driver
    const driverSms: NotificationItem = {
      id: `sms-app-${Date.now()}`,
      type: 'sms',
      title: `SMS Sent to ${application.phone}`,
      message: `[Matshelonyana]: Dumela ${application.fullName}! We received your driver registration and uploaded Omang ID. The App Owner will review and verify your documents shortly.`,
      timestamp: 'Just now',
      urgent: true,
      recipientPhone: application.phone,
      read: false,
    };

    setNotifications((prev) => [ownerNotif, driverSms, ...prev]);
  };

  // App Owner approves driver
  const handleApproveDriver = (applicationId: string) => {
    const app = driverApplications.find((a) => a.id === applicationId);
    if (!app) return;

    setDriverApplications((prev) =>
      prev.map((a) => (a.id === applicationId ? { ...a, status: 'approved', reviewedAt: 'Just now' } : a))
    );

    // Create verified driver bid entity
    const newVerifiedDriver: DriverBid = {
      id: `drv-${app.id}`,
      driverId: `drv-${app.id}`,
      driverName: app.fullName,
      driverPhone: app.phone,
      driverAvatar: '/src/assets/images/avatar_driver_kgosi_1790988349051.jpg',
      truckType: app.truckType,
      truckPlate: app.truckPlate,
      rating: 5.0,
      completedHauls: 0,
      proposedFareBWP: 450,
      helpersOffered: 2,
      counterOfferNote: 'Newly verified by App Owner with Botswana Omang & DRTS Permit.',
      etaMinutes: 10,
      submittedAt: 'Just now',
      status: 'pending',
    };

    AVAILABLE_DRIVERS.unshift(newVerifiedDriver);

    // Notify driver via SMS
    const approvalSms: NotificationItem = {
      id: `sms-appr-${Date.now()}`,
      type: 'sms',
      title: `SMS Sent to ${app.phone}`,
      message: `[Matshelonyana Notice]: Congratulations ${app.fullName}! Your Omang ID and Driver's Licence have been APPROVED by the App Owner. You are now authorized to accept hauls and earn 95% fares.`,
      timestamp: 'Just now',
      urgent: true,
      recipientPhone: app.phone,
      read: false,
    };

    // App Owner log
    const ownerPush: NotificationItem = {
      id: `notif-appr-${Date.now()}`,
      type: 'push',
      title: `Driver Approved: ${app.fullName}`,
      message: `Verified Omang ID (${app.omangNumber}) and activated transport badge for ${app.truckPlate}.`,
      timestamp: 'Just now',
      urgent: false,
      read: false,
    };

    setNotifications((prev) => [approvalSms, ownerPush, ...prev]);
  };

  // App Owner rejects driver
  const handleRejectDriver = (applicationId: string, reason: string) => {
    const app = driverApplications.find((a) => a.id === applicationId);
    if (!app) return;

    setDriverApplications((prev) =>
      prev.map((a) =>
        a.id === applicationId
          ? { ...a, status: 'rejected', rejectionReason: reason, reviewedAt: 'Just now' }
          : a
      )
    );

    // Send SMS alert with rejection reason
    const rejectionSms: NotificationItem = {
      id: `sms-rej-${Date.now()}`,
      type: 'sms',
      title: `SMS Sent to ${app.phone}`,
      message: `[Matshelonyana Logistics]: Your transporter application was declined by the App Owner: "${reason}". Please log in to update your documents.`,
      timestamp: 'Just now',
      urgent: true,
      recipientPhone: app.phone,
      read: false,
    };

    setNotifications((prev) => [rejectionSms, ...prev]);
  };

  // Create new haul (Sender)
  const handleCreateJob = async (newJob: Job) => {
    if (!isOnline) {
      setOfflineQueue((prev) => [
        ...prev,
        {
          id: `queue-${Date.now()}`,
          action: 'SUBMIT_BID',
          payload: newJob,
          queuedAt: new Date().toLocaleTimeString(),
        },
      ]);
    }

    setJobs((prev) => [newJob, ...prev]);
    setActiveJobId(newJob.id);

    // Add push alert
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      type: 'push',
      title: `Haul Broadcasted: ${newJob.jobCode}`,
      message: `Your haul "${newJob.title}" is now broadcasting to verified truck drivers in Gaborone.`,
      timestamp: 'Just now',
      urgent: false,
      jobCode: newJob.jobCode,
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    // Simulate an incoming driver bid after 3.5 seconds
    setTimeout(() => {
      const incomingBid: DriverBid = {
        id: `bid-auto-${Date.now()}`,
        driverId: 'drv-kgosi-01',
        driverName: 'Kgosi Mogorosi',
        driverPhone: '+267 72 419 802',
        driverAvatar: '/src/assets/images/avatar_driver_kgosi_1790988349051.jpg',
        truckType: '1-Ton Bakkie (Hilux/D-Max)',
        truckPlate: 'B 492 BAZ',
        rating: 4.95,
        completedHauls: 285,
        proposedFareBWP: newJob.customerProposedFareBWP,
        helpersOffered: newJob.helpersRequired,
        counterOfferNote: 'I accept your proposed fare. Moving blankets and ratchet straps ready.',
        etaMinutes: 8,
        submittedAt: 'Just now',
        status: 'pending',
      };

      setJobs((prev) =>
        prev.map((j) => {
          if (j.id === newJob.id) {
            return {
              ...j,
              bids: [incomingBid, ...j.bids],
            };
          }
          return j;
        })
      );

      const bidNotif: NotificationItem = {
        id: `notif-bid-${Date.now()}`,
        type: 'push',
        title: `New Offer on ${newJob.jobCode}`,
        message: `Kgosi Mogorosi accepted your proposed fare of P ${newJob.customerProposedFareBWP}.00!`,
        timestamp: 'Just now',
        urgent: true,
        jobCode: newJob.jobCode,
        read: false,
      };
      setNotifications((prev) => [bidNotif, ...prev]);
    }, 3500);
  };

  // Customer accepts a driver bid & funds escrow
  const handleAcceptBid = async (jobId: string, bid: DriverBid) => {
    const job = jobs.find((j) => j.id === jobId);
    if (!job) return;

    const agreedFare = bid.proposedFareBWP;
    const hash = await generateSHA256Hash(`${job.jobCode}_${agreedFare}_EscrowHold_${Date.now()}`);

    const newTx: TransactionRecord = {
      id: `tx-${Date.now()}`,
      jobCode: job.jobCode,
      transactionType: 'Escrow Hold',
      amountBWP: agreedFare,
      fromParty: `${job.customerName} (Escrow Secured)`,
      toParty: 'Matshelonyana Digital Escrow Vault',
      timestamp: new Date().toLocaleString(),
      paymentMethod: 'Orange Money',
      verificationHash: hash,
      status: 'Confirmed & Encrypted',
    };

    setTransactions((prev) => [newTx, ...prev]);

    setJobs((prev) =>
      prev.map((j) => {
        if (j.id === jobId) {
          return {
            ...j,
            currentStatus: 'en_route_pickup',
            agreedFareBWP: agreedFare,
            assignedDriverId: bid.driverId,
            assignedDriver: bid,
            escrowStatus: 'held_in_escrow',
            escrowReleaseCode: String(Math.floor(1000 + Math.random() * 9000)),
            milestones: [
              { status: 'accepted', label: 'Bid Accepted & Driver Assigned', timestamp: 'Just now', completed: true },
              { status: 'en_route_pickup', label: 'Driver En Route to Pickup', timestamp: 'Just now', completed: true },
            ],
          };
        }
        return j;
      })
    );

    // Dispatch SMS notification to driver
    const smsNotif: NotificationItem = {
      id: `sms-${Date.now()}`,
      type: 'sms',
      title: `SMS Sent to ${bid.driverPhone}`,
      message: `[Matshelonyana]: You were awarded Trip ${job.jobCode}! Escrow of P ${agreedFare}.00 is locked. Navigate to: ${job.pickup.name}`,
      timestamp: 'Just now',
      urgent: true,
      recipientPhone: bid.driverPhone,
      jobCode: job.jobCode,
      read: false,
    };
    setNotifications((prev) => [smsNotif, ...prev]);
  };

  // Driver quick-accepts
  const handleDriverAcceptDirect = (jobId: string, bid: DriverBid) => {
    handleAcceptBid(jobId, bid);
  };

  // Driver submits counter-bid
  const handleSubmitCounterBid = (jobId: string, counterBid: DriverBid) => {
    setJobs((prev) =>
      prev.map((j) => {
        if (j.id === jobId) {
          return {
            ...j,
            bids: [counterBid, ...j.bids],
          };
        }
        return j;
      })
    );

    const notif: NotificationItem = {
      id: `notif-counter-${Date.now()}`,
      type: 'push',
      title: `New Counter-Bid: P ${counterBid.proposedFareBWP}.00`,
      message: `${counterBid.driverName} counter-offered P ${counterBid.proposedFareBWP} with ${counterBid.helpersOffered} helpers.`,
      timestamp: 'Just now',
      urgent: false,
      jobCode: jobs.find((j) => j.id === jobId)?.jobCode,
      read: false,
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  // Advance milestone
  const handleUpdateJobStatus = (jobId: string, status: JobStatus, milestoneLabel: string) => {
    if (!isOnline) {
      setOfflineQueue((prev) => [
        ...prev,
        {
          id: `queue-${Date.now()}`,
          action: 'UPDATE_JOB_STATUS',
          payload: { jobId, status, milestoneLabel },
          queuedAt: new Date().toLocaleTimeString(),
        },
      ]);
    }

    setJobs((prev) =>
      prev.map((j) => {
        if (j.id === jobId) {
          return {
            ...j,
            currentStatus: status,
            milestones: [
              ...j.milestones,
              { status, label: milestoneLabel, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), completed: true },
            ],
          };
        }
        return j;
      })
    );

    // Dispatch SMS alert to customer
    const targetJob = jobs.find((j) => j.id === jobId);
    if (targetJob) {
      const sms: NotificationItem = {
        id: `sms-milestone-${Date.now()}`,
        type: 'sms',
        title: `SMS Sent to ${targetJob.customerPhone}`,
        message: `[Matshelonyana]: Trip ${targetJob.jobCode} update: ${milestoneLabel}. Live tracking active.`,
        timestamp: 'Just now',
        urgent: true,
        recipientPhone: targetJob.customerPhone,
        jobCode: targetJob.jobCode,
        read: false,
      };
      setNotifications((prev) => [sms, ...prev]);
    }
  };

  // Customer releases escrow upon delivery -> AUTOMATIC 5% APP OWNER CUT DEDUCTION!
  const handleReleaseEscrow = async (jobId: string) => {
    const job = jobs.find((j) => j.id === jobId);
    if (!job) return;

    const grossAmount = job.agreedFareBWP || job.customerProposedFareBWP;
    
    // Exact 5% App Owner Commission
    const appOwnerCommission = grossAmount * 0.05;
    const driverNetPayout = grossAmount * 0.95;

    const releaseHash = await generateSHA256Hash(`${job.jobCode}_${grossAmount}_EscrowRelease_${Date.now()}`);
    const commissionHash = await generateSHA256Hash(`${job.jobCode}_${appOwnerCommission}_OwnerCommission5%_${Date.now()}`);

    // 1. Transaction: 95% Driver Payout
    const payoutTx: TransactionRecord = {
      id: `tx-payout-${Date.now()}`,
      jobCode: job.jobCode,
      transactionType: 'Driver Payout (95%)',
      amountBWP: driverNetPayout,
      fromParty: 'Matshelonyana Escrow Vault',
      toParty: `${job.assignedDriver?.driverName || 'Driver'} (Orange Money)`,
      timestamp: new Date().toLocaleString(),
      paymentMethod: 'Orange Money',
      verificationHash: releaseHash,
      status: 'Confirmed & Encrypted',
    };

    // 2. Transaction: 5% App Owner Platform Commission
    const ownerTx: TransactionRecord = {
      id: `tx-owner-${Date.now()}`,
      jobCode: job.jobCode,
      transactionType: 'App Owner 5% Commission',
      amountBWP: appOwnerCommission,
      fromParty: `Trip ${job.jobCode} Escrow Release (5% Platform Cut)`,
      toParty: 'Matshelonyana App Owner Treasury Account',
      timestamp: new Date().toLocaleString(),
      paymentMethod: 'Orange Money',
      verificationHash: commissionHash,
      status: 'Confirmed & Encrypted',
    };

    setTransactions((prev) => [ownerTx, payoutTx, ...prev]);

    setJobs((prev) =>
      prev.map((j) => {
        if (j.id === jobId) {
          return {
            ...j,
            escrowStatus: 'released',
            currentStatus: 'completed',
          };
        }
        return j;
      })
    );

    // SMS to driver with 95% net and 5% breakdown
    const smsAlert: NotificationItem = {
      id: `sms-payout-${Date.now()}`,
      type: 'sms',
      title: `SMS Sent to Driver (${job.assignedDriver?.driverPhone || '+267 72 419 802'})`,
      message: `[Matshelonyana]: Payment released! P ${driverNetPayout.toFixed(2)} (95%) credited to your Orange Money wallet. App Owner 5% fee: P ${appOwnerCommission.toFixed(2)}. Verification: ${releaseHash.slice(0, 10)}.`,
      timestamp: 'Just now',
      urgent: true,
      recipientPhone: job.assignedDriver?.driverPhone,
      jobCode: job.jobCode,
      read: false,
    };

    // Push alert for App Owner
    const ownerAlert: NotificationItem = {
      id: `notif-comm-${Date.now()}`,
      type: 'push',
      title: `5% Commission Earned: +P ${appOwnerCommission.toFixed(2)}`,
      message: `Trip ${job.jobCode} completed. 5% platform commission automatically credited to App Owner Treasury account.`,
      timestamp: 'Just now',
      urgent: false,
      read: false,
    };

    setNotifications((prev) => [ownerAlert, smsAlert, ...prev]);
  };

  // Submit rating
  const handleSubmitRating = (jobId: string, stars: number, compliments: string[], review: string) => {
    setJobs((prev) =>
      prev.map((j) => {
        if (j.id === jobId) {
          return {
            ...j,
            ratingGiven: {
              stars,
              compliments,
              reviewText: review,
              createdAt: new Date().toISOString(),
            },
          };
        }
        return j;
      })
    );
  };

  // Chat message send
  const handleSendMessage = (jobId: string, text: string) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      jobId,
      senderId: currentRole === 'customer' ? 'cust-amantle' : 'drv-kgosi-01',
      senderName: currentRole === 'customer' ? 'Amantle (Sender)' : 'Kgosi (Driver)',
      senderRole: currentRole === 'customer' ? 'customer' : 'driver',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => ({
      ...prev,
      [jobId]: [...(prev[jobId] || []), newMsg],
    }));
  };

  // Dispatch broadcast from admin console
  const handleTriggerBroadcastAlert = (title: string, message: string, urgent: boolean, sendSms: boolean) => {
    const pushNotif: NotificationItem = {
      id: `notif-bc-${Date.now()}`,
      type: 'push',
      title,
      message,
      timestamp: 'Just now',
      urgent,
      read: false,
    };

    const notifsToAdd: NotificationItem[] = [pushNotif];

    if (sendSms) {
      const smsNotif: NotificationItem = {
        id: `sms-bc-${Date.now()}`,
        type: 'sms',
        title: `Fleet SMS Broadcast Dispatched`,
        message: `[Matshelonyana Notice]: ${message}`,
        timestamp: 'Just now',
        urgent,
        recipientPhone: '+267 (All Active Drivers)',
        read: false,
      };
      notifsToAdd.push(smsNotif);
    }

    setNotifications((prev) => [...notifsToAdd, ...prev]);
  };

  // Sync offline queue
  const handleSyncOfflineQueue = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setOfflineQueue([]);
      setIsSyncing(false);
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.6 },
      });
    }, 1200);
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;
  const pendingDriverAppsCount = driverApplications.filter((a) => a.status === 'pending').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        currentRole={currentRole}
        onSelectRole={setCurrentRole}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        unreadNotificationsCount={unreadNotificationsCount}
        onOpenNotifications={() => setShowNotificationDrawer(true)}
        isOnline={isOnline}
        onToggleOnline={() => setIsOnline(!isOnline)}
        pendingOfflineCount={offlineQueue.length}
        onOpenNewHaul={() => setShowNewHaulModal(true)}
        onOpenDriverRegister={() => setShowDriverRegisterModal(true)}
        pendingDriverAppsCount={pendingDriverAppsCount}
      />

      {/* Offline sync status banner */}
      <OfflineSyncBanner
        isOnline={isOnline}
        pendingCount={offlineQueue.length}
        onSyncNow={handleSyncOfflineQueue}
        isSyncing={isSyncing}
      />

      {/* Main Workspace Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Navigation Tab: Live GPS Tracking dedicated view */}
        {activeTab === 'tracking' && (
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-lg font-bold text-white flex items-center gap-2">
                  <Truck className="w-5 h-5 text-sky-400" />
                  <span>Matshelonyana Live GPS Radar</span>
                </h1>
                <p className="text-xs text-slate-400">
                  Tracking active heavy haul {activeJob.jobCode} across Botswana highway corridors.
                </p>
              </div>

              {/* Quick Trip Selector */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                {jobs.map((j) => (
                  <button
                    key={j.id}
                    onClick={() => setActiveJobId(j.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                      j.id === activeJob.id
                        ? 'bg-sky-600 text-white'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {j.jobCode}
                  </button>
                ))}
              </div>
            </div>

            <MapView job={activeJob} />
          </div>
        )}

        {/* Navigation Tab: Digital Ledger standalone view */}
        {activeTab === 'ledger' && (
          <AnalyticsDashboard
            transactions={transactions}
            notifications={notifications}
            offlineQueue={offlineQueue}
            onTriggerBroadcastAlert={handleTriggerBroadcastAlert}
            isOnline={isOnline}
          />
        )}

        {/* Navigation Tab: Operations & Fleet Analytics */}
        {activeTab === 'analytics' && (
          <AnalyticsDashboard
            transactions={transactions}
            notifications={notifications}
            offlineQueue={offlineQueue}
            onTriggerBroadcastAlert={handleTriggerBroadcastAlert}
            isOnline={isOnline}
          />
        )}

        {/* Navigation Tab: Primary Role Views (Customer, Driver, or App Owner) */}
        {activeTab === 'hauls' && (
          <>
            {currentRole === 'customer' && (
              <CustomerView
                jobs={jobs}
                activeJobId={activeJobId}
                onSelectJob={setActiveJobId}
                onAcceptBid={handleAcceptBid}
                onReleaseEscrow={handleReleaseEscrow}
                onSubmitRating={handleSubmitRating}
                messages={messages}
                onSendMessage={handleSendMessage}
                onOpenNewHaul={() => setShowNewHaulModal(true)}
              />
            )}

            {currentRole === 'driver' && (
              <DriverView
                jobs={jobs}
                onAcceptJobDirect={handleDriverAcceptDirect}
                onSubmitCounterBid={handleSubmitCounterBid}
                onUpdateJobStatus={handleUpdateJobStatus}
                messages={messages}
                onSendMessage={handleSendMessage}
                isOnline={isOnline}
              />
            )}

            {currentRole === 'owner' && (
              <AppOwnerPortal
                applications={driverApplications}
                onApproveApplication={handleApproveDriver}
                onRejectApplication={handleRejectDriver}
                transactions={transactions}
                jobs={jobs}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950 text-slate-400 py-6 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white tracking-wide">Matshelonyana</span>
            <span>·</span>
            <span>Goods & Heavy Haulage Transport</span>
            <span>·</span>
            <span>Republic of Botswana</span>
          </div>

          <div className="flex items-center gap-4 text-slate-500 text-[11px]">
            <span className="flex items-center gap-1 text-sky-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>5% Commission Automated</span>
            </span>
            <span>·</span>
            <span>Omang ID KYC Verified</span>
            <span>·</span>
            <span>Zero Third-Party Ads</span>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <NewHaulModal
        isOpen={showNewHaulModal}
        onClose={() => setShowNewHaulModal(false)}
        onCreateJob={handleCreateJob}
      />

      <DriverRegistrationModal
        isOpen={showDriverRegisterModal}
        onClose={() => setShowDriverRegisterModal(false)}
        onSubmitApplication={handleRegisterDriver}
      />

      <NotificationDrawer
        isOpen={showNotificationDrawer}
        onClose={() => setShowNotificationDrawer(false)}
        notifications={notifications}
        onMarkAllAsRead={() => {
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        }}
      />
    </div>
  );
}
