import './index.css';
import styles from './index.module.css';

import * as React from 'react';
import { render } from 'react-dom';

document.addEventListener('DOMContentLoaded', () => {
  const base = document.createElement('div');
  document.body.prepend(base);
  render(<div className={styles.valueAdded}>{'Hello'}</div>, base);
});
