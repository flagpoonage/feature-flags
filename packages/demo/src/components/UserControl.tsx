import * as React from 'react';
import styles from './styles/UserControl.module.css';
import { getContextValue, setContextValue } from './UserContext';

export function UserControl(): React.ReactElement {
  const [userState, setUserState] = React.useState(getContextValue().name);

  return (
    <div className={styles.container}>
      <input
        type="text"
        value={userState}
        onChange={(e) => setUserState(e.target.value)}
      />
      <button
        type="button"
        onClick={() => setContextValue({ name: userState })}
      >
        Commit Name
      </button>
    </div>
  );
}
