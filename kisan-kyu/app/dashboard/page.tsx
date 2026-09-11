"use client";

import Link from 'next/link';
import { useStore } from '../../lib/store';
import styles from './page.module.css';
import { ArrowLeft, LayoutDashboard, AlertCircle } from 'lucide-react';

export default function DashboardSimulator() {
  const { kiosk, isHydrated } = useStore();

  if (!isHydrated) return null;

  const totalLots = kiosk.syncedQueue.length;
  const avgWait = totalLots > 0 ? Math.round(kiosk.syncedQueue.reduce((acc, q) => acc + q.waitTime, 0) / totalLots) : 0;
  
  // Real check for overload (e.g. queue > 5)
  const isCentreAHighLoad = kiosk.syncedQueue.filter(q => q.status === 'waiting').length > 5;
  
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/" className={styles.navBack}><ArrowLeft size={20} /></Link>
        <LayoutDashboard size={24} color="var(--primary)" />
        <h1 className={styles.title}>Govt Analytics & Root-Cause Dashboard</h1>
      </header>

      <main className={styles.main}>
        <div className={styles.metricsGrid}>
          <div className={styles.metricCard}>
            <h3>Total Procured Today (Synced)</h3>
            <div className={styles.metricValue}>{totalLots} Lots</div>
          </div>
          <div className={styles.metricCard}>
            <h3>Avg Wait Time (Statewide)</h3>
            <div className={styles.metricValue}>{avgWait} mins</div>
          </div>
          <div className={styles.metricCard}>
            <h3>Open Grievances</h3>
            <div className={styles.metricValue} style={{color: 'var(--error)'}}>3</div>
          </div>
        </div>

        <div className={styles.grid2}>
          <div className={styles.panel}>
            <h2>Live Centre Load Balancing</h2>
            <div className={styles.centreList}>
              <div className={styles.centreRow}>
                <div>
                  <div className={styles.centreName}>Centre A (Demo Site)</div>
                  <div style={{fontSize: '0.85rem', color: 'var(--secondary-light)'}}>Wait Time: {avgWait} mins</div>
                  <div className={styles.loadBarBg}>
                    <div className={`${styles.loadBarFill} ${isCentreAHighLoad ? styles.high : styles.medium}`} style={{width: isCentreAHighLoad ? '95%' : '50%'}}></div>
                  </div>
                </div>
                <div style={{textAlign: 'right'}}>
                  <div style={{fontWeight: 600, color: isCentreAHighLoad ? 'var(--error)' : 'inherit'}}>
                    {isCentreAHighLoad ? 'Overloaded' : 'Normal'}
                  </div>
                  {isCentreAHighLoad && <div style={{fontSize: '0.8rem', color: 'var(--primary)'}}>Auto-Redirecting to Centre B</div>}
                </div>
              </div>

              <div className={styles.centreRow}>
                <div>
                  <div className={styles.centreName}>Centre B (Nearby)</div>
                  <div style={{fontSize: '0.85rem', color: 'var(--secondary-light)'}}>Wait Time: 20 mins</div>
                  <div className={styles.loadBarBg}>
                    <div className={`${styles.loadBarFill} ${styles.low}`} style={{width: '20%'}}></div>
                  </div>
                </div>
                <div style={{textAlign: 'right'}}>
                  <div style={{fontWeight: 600, color: 'var(--success)'}}>Available</div>
                  {isCentreAHighLoad && <div style={{fontSize: '0.8rem', color: 'var(--primary)'}}>Receiving overflow from A</div>}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.panel}>
            <h2>Active Grievances <AlertCircle size={16} color="var(--error)" style={{display: 'inline'}} /></h2>
            <div className={styles.grievanceList}>
              <div className={styles.grievanceTicket}>
                <div className={styles.ticketTitle}>Payment Delay &gt; 48hrs</div>
                <div className={styles.ticketMeta}>Farmer: Mukesh P. | Token: #9902<br/>Centre: Karnal Mandi</div>
              </div>
              <div className={styles.grievanceTicket}>
                <div className={styles.ticketTitle}>Queue Manipulation Flag</div>
                <div className={styles.ticketMeta}>Farmer: Rajesh K. | Token: #8112<br/>Centre: Panipat Mandi</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}