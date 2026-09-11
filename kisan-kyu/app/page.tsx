import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <header className={styles.hero}>
        <h1>Kisan Kyu</h1>
        <p>A Predictive, Proactive Farmer Procurement & Queue Management System for MSP Centres</p>
      </header>
      
      <main className={styles.cards}>
        <div className={styles.card}>
          <h2>1. Farmer Interface</h2>
          <p>Simulate the IVR missed-call booking, wait-time prediction SMS, and payment delay tracking designed for low-literacy farmers.</p>
          <Link href="/farmer" className={styles.button}>Launch Simulator</Link>
        </div>
        
        <div className={styles.card}>
          <h2>2. Centre Kiosk</h2>
          <p>Simulate the offline-first tablet app used by centre operators to manage queues, accept lots, and sync data when internet returns.</p>
          <Link href="/kiosk" className={styles.button}>Launch Simulator</Link>
        </div>
        
        <div className={styles.card}>
          <h2>3. Govt Dashboard</h2>
          <p>Simulate the central dashboard showing multi-centre load balancing, anomaly detection, and live grievance tickets.</p>
          <Link href="/dashboard" className={styles.button}>Launch Simulator</Link>
        </div>
      </main>
    </div>
  );
}
