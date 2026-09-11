"use client";

import Link from 'next/link';
import { useStore } from '../../lib/store';
import styles from './page.module.css';
import { ArrowLeft, Wifi, WifiOff, Database } from 'lucide-react';
import { useState } from 'react';

export default function KioskSimulator() {
  const { kiosk, toggleOffline, acceptLot, addQueueItem, isHydrated } = useStore();
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [crop, setCrop] = useState('Wheat');
  const [qty, setQty] = useState('');

  const handleGenerateToken = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !qty) return;
    
    addQueueItem({ name, phone, crop, qty: qty + 'Q' });
    
    // reset
    setName('');
    setPhone('');
    setQty('');
  };

  if (!isHydrated) return null; // Avoid hydration mismatch on local storage load

  const allQueue = [...kiosk.syncedQueue, ...kiosk.offlineQueue];
  const activeLanes = 3; // From our store logic
  const avgWait = allQueue.length > 0 ? Math.round(allQueue.reduce((acc, q) => acc + q.waitTime, 0) / allQueue.length) : 0;

  return (
    <div className={styles.container}>
      <div className={styles.tablet}>
        <div className={styles.header}>
          <div className={styles.title}>
            <Link href="/" className={styles.navBack}><ArrowLeft size={24} /></Link>
            Centre Kiosk (Offline Node)
          </div>
          <div className={styles.controls}>
            <div className={styles.syncStatus}>
              {kiosk.offlineQueue.length > 0 ? (
                <><Database size={14} style={{display: 'inline', marginRight: '4px'}}/> {kiosk.offlineQueue.length} unsynced</>
              ) : "All Synced"}
            </div>
            <button 
              className={`${styles.offlineToggle} ${kiosk.isOffline ? styles.isOffline : ''}`}
              onClick={toggleOffline}
            >
              {kiosk.isOffline ? <><WifiOff size={18}/> Offline Mode</> : <><Wifi size={18}/> Online Mode</>}
            </button>
          </div>
        </div>
        
        <div className={styles.main}>
          {/* New Form Panel */}
          <form className={styles.formPanel} onSubmit={handleGenerateToken}>
            <h2 style={{fontSize: '1.2rem', marginBottom: '0.5rem'}}>Generate Token</h2>
            <div className={styles.formGroup}>
              <label>Farmer Name</label>
              <input className={styles.input} type="text" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className={styles.formGroup}>
              <label>Phone Number</label>
              <input className={styles.input} type="tel" value={phone} onChange={e => setPhone(e.target.value)} required />
            </div>
            <div className={styles.formGroup}>
              <label>Crop Type</label>
              <select className={styles.input} value={crop} onChange={e => setCrop(e.target.value)}>
                <option>Wheat</option>
                <option>Paddy</option>
                <option>Mustard</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Quantity (Quintals)</label>
              <input className={styles.input} type="number" value={qty} onChange={e => setQty(e.target.value)} required />
            </div>
            <button type="submit" className={styles.submitBtn}>Generate Token</button>
          </form>

          <div className={styles.sidebar}>
            <div className={styles.statCard}>
              <h3>Avg Wait Time</h3>
              <div className={styles.statValue}>~{avgWait}m</div>
              <p style={{fontSize: '0.85rem', color: '#333'}}>M/M/c Prediction</p>
            </div>
            <div className={styles.statCard}>
              <h3>Active Lanes</h3>
              <div className={styles.statValue}>{activeLanes}</div>
            </div>
            <div className={styles.statCard}>
              <h3>Queue Length</h3>
              <div className={styles.statValue}>{allQueue.filter(q => q.status === 'waiting').length}</div>
            </div>
          </div>
          
          <div className={styles.content}>
            <h2 style={{marginBottom: '1rem'}}>Live Queue</h2>
            <table className={styles.queueTable}>
              <thead>
                <tr>
                  <th>Token ID</th>
                  <th>Farmer Details</th>
                  <th>Est. Wait</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {allQueue.map(item => (
                  <tr key={item.id}>
                    <td style={{fontWeight: 'bold', color: 'var(--primary)'}}>#{item.id.slice(-4)}</td>
                    <td>
                      <div style={{fontWeight: 600}}>{item.name}</div>
                      <div style={{fontSize: '0.85rem', color: '#333'}}>{item.crop} - {item.qty}</div>
                    </td>
                    <td>{item.waitTime} mins</td>
                    <td>
                      <span className={`${styles.statusBadge} ${styles[item.status]}`}>
                        {item.status.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <button 
                        className={styles.actionBtn}
                        disabled={item.status !== 'waiting'}
                        onClick={() => acceptLot(item.id)}
                      >
                        Accept
                      </button>
                    </td>
                  </tr>
                ))}
                {allQueue.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{textAlign: 'center', padding: '2rem', color: '#94a3b8'}}>Queue is empty</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}