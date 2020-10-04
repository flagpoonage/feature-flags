import * as React from 'react';
import { FlagsList } from './FlagsList';
import styles from './styles/Page.module.css';
import { useContextValue, UserContext } from './UserContext';
import { UserControl } from './UserControl';

export function Page(): React.ReactElement {
  const value = useContextValue();

  return (
    <UserContext.Provider value={value}>
      <div className={styles.page}>
        <UserControl />
        <FlagsList />
      </div>
    </UserContext.Provider>
  );
}
