import useState from '../../utils/use-state';

const tabList = document.querySelector('.tab-list');
const createTabSystem = (tabsConfig) => {
  const [activeTab, setActiveTab] = useState(null);

  const tabEntries = Object.entries(tabsConfig);
  for (let i = 0; i < tabEntries.length; i += 1) {
    const [tabName, callback] = tabEntries[i];
    const tabItem = document.createElement('li');
    tabItem.role = 'presentation';

    const tabLink = document.createElement('a');
    tabLink.href = '#';
    tabLink.role = 'tab';
    tabLink.id = `tab-${tabName.toLowerCase()}`;
    tabLink.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    tabLink.setAttribute('aria-controls', `view-${tabName.toLowerCase()}`);
    tabLink.textContent = tabName;
    tabLink.classList.add('tab-link');
    tabItem.append(tabLink);
    tabList.append(tabItem);
    if (i === 0) {
      tabLink.classList.add('active');
      setActiveTab(tabLink);
    }
    tabLink.addEventListener('click', (e) => {
      e.preventDefault();
      const currActiveTab = activeTab();
      if (currActiveTab instanceof HTMLElement && currActiveTab !== tabLink) {
        currActiveTab.setAttribute('aria-selected', 'false');
        currActiveTab.classList.remove('active');
        tabLink.setAttribute('aria-selected', 'true');
        tabLink.classList.add('active');
        setActiveTab(tabLink);
        callback();
      }
    });
  }
};

export default createTabSystem;
