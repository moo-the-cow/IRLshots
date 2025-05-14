import React, { useContext } from 'react';
import { AppContext } from './contexts/AppContext';
import MainLayout from './layouts/MainLayout';
import ObsConnectionTab from './components/tabs/ObsConnectionTab';
import SettingsTab from './components/tabs/SettingsTab';
import ChatIntegrationTab from './components/tabs/ChatIntegrationTab';
import { TabButton, Button } from './components/common/StyledInputs';

function App() {
  const { activeTab, setActiveTab, saveConfig } = useContext(AppContext);

  const renderActiveTab = () => {
    switch (activeTab) {
      case 0:
        return <ObsConnectionTab />;
      case 1:
        return <SettingsTab />;
      case 2:
        return <ChatIntegrationTab />;
      default:
        return <ObsConnectionTab />;
    }
  };

  // Create tab elements using styled TabButton component
  const tabElements = [
    <TabButton
      key="obs"
      onClick={() => setActiveTab(0)}
      active={activeTab === 0}
    >
      OBS Connection
    </TabButton>,
    <TabButton
      key="settings"
      onClick={() => setActiveTab(1)}
      active={activeTab === 1}
    >
      Settings
    </TabButton>,
    <TabButton
      key="chat"
      onClick={() => setActiveTab(2)}
      active={activeTab === 2}
    >
      Chat Integration
    </TabButton>
  ];

  // Create save button  
  const saveButton = (
    <Button
      onClick={saveConfig}
      variant="info"
      className="flex items-center gap-2"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5 4a2 2 0 00-2 2v8a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 2H8.828a2 2 0 00-1.414.586L6.293 3.707A1 1 0 015.586 4H5z" clipRule="evenodd" />
      </svg>
      Save Settings
    </Button>
  );

  return (
    <MainLayout
      tabs={tabElements}
      saveButton={saveButton}
    >
      {renderActiveTab()}
    </MainLayout>
  );
}

export default App;
