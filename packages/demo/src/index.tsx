import './index.css';
import * as React from 'react';
import { render } from 'react-dom';
import { Page } from './components/Page';

document.addEventListener('DOMContentLoaded', () => {
  const base = document.createElement('div');
  document.body.prepend(base);
  render(<Page />, base);
});
