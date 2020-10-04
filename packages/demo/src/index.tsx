import styles from './index.module.css';

import * as React from 'react';
import { render } from 'react-dom';

document.addEventListener('DOMContentLoaded', () => {
  render(
    <div className={styles.valueAdded}>{'Hello'}</div>,
    document.getElementById('app')
  );
});
