import * as React from 'react';
import styles from './styles/FlagsList.module.css';
import { UserContext } from './UserContext';

export function FlagsList(): React.ReactElement {
  const user = React.useContext(UserContext);

  return <div className={styles.container}>{user.name}</div>;
}
