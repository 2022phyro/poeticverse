import React, { useEffect, useState } from 'react';

function DarkModeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const checkbox = document.querySelector("input");
    const body = document.querySelector("body");

    const handleCheckboxChange = (event) => {
      setIsDarkMode(event.target.checked);

      if (event.target.checked) {
        body.setAttribute('data-theme', 'dark');
      } else {
        body.removeAttribute('data-theme');
      }
    };

    checkbox.addEventListener('change', handleCheckboxChange);

    return () => {
      checkbox.removeEventListener('change', handleCheckboxChange);
    };
  }, []);

  return (
    <label className="switch">
      <input type="checkbox" checked={isDarkMode} onChange={() => setIsDarkMode(!isDarkMode)} />
    <span className="slider"></span>
  </label>

  );
}

export default DarkModeToggle;
