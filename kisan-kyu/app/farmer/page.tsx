"use client";

import Link from 'next/link';
import { useStore } from '../../lib/store';
import styles from './page.module.css';
import { Phone, ArrowLeft } from 'lucide-react';
import { useState } from 'react';

export default function FarmerSimulator() {
  const { farmer, bookSlot } = useStore();
  const [calling, setCalling] = useState(false);

  const handleCall = () => {
    setCalling(true);
    setTimeout(() => {
      bookSlot();
      setCalling(false);
    }, 2000);
  };

  return (
    <div className={styles.container}>
      <div className={styles.phone}>
        <div className={styles.header}>
          <Link href="/" className={styles.navBack}><ArrowLeft size={16} /></Link>
          Kisan Kyu SMS
        </div>
        
        <div className={styles.screen}>
          {farmer.smsMessages.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#94a3b8', marginTop: '2rem' }}>
              No messages yet.<br/>Give a missed call to book a slot.
            </div>
          ) : (
            farmer.smsMessages.map(msg => (
              <div key={msg.id} className={`${styles.sms} ${styles[msg.type]}`}>
                <div className={styles.smsTime}>{msg.time}</div>
                <div>{msg.text}</div>
              </div>
            ))
          )}
        </div>

        <div className={styles.actions}>
          <button 
            className={styles.callBtn} 
            onClick={handleCall}
            disabled={farmer.isBooked || calling}
          >
            <Phone size={20} />
            {calling ? "Calling..." : farmer.isBooked ? "Slot Booked" : "Missed Call to Book"}
          </button>
        </div>
      </div>
    </div>
  );
}
