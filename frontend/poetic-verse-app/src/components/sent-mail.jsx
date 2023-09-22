import React from 'react';
import '../styles/index.css';

function SentEmail() {
  return (
    <div className="sent-email">
      <div className="sent-email-header">
        <h2>Email sent</h2>
      </div>
      <div className="sent-email-icon">
        {/* You can replace this with your sent email icon */}
        <svg xmlns="http://www.w3.org/2000/svg" width="90" height="90" viewBox="0 0 90 90" fill="none">
  <g clip-path="url(#clip0_437_1047)">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M89.0589 0.941535C89.9569 1.83974 90.2417 3.18266 89.7859 4.36824L57.6429 87.9396C57.178 89.1482 56.033 89.9601 54.7384 89.9987C53.4438 90.0373 52.2526 89.2948 51.7167 88.1158L38.2748 58.5437L58.0521 38.7664C59.935 36.8835 59.935 33.8307 58.0521 31.9479C56.1693 30.065 53.1165 30.065 51.2336 31.9479L31.4562 51.7253L1.88421 38.2834C0.705156 37.7475 -0.0370659 36.5563 0.00142873 35.2617C0.0399236 33.9672 0.851618 32.8221 2.06043 32.3572L85.6318 0.214339C86.8172 -0.241654 88.1601 0.0433336 89.0589 0.941535Z" fill="white"/>
  </g>
  <defs>
    <clipPath id="clip0_437_1047">
      <rect width="90" height="90" fill="white"/>
    </clipPath>
  </defs>
</svg>
      </div>
      <div className="sent-email-text">
        <p>Your poetic message has been dispatched! An email carrying  words ment for your eyes has taken flight, destined to grace your inbox.</p>
      </div>
      <div className="sent-email-button">
        <button className="continue-button">Continue</button>
      </div>
    </div>
  );
}

export default SentEmail;
