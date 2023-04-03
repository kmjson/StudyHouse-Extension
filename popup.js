const tabs = await chrome.tabs.query({});
console.log(tabs)

// Sort the Tabs


const collator = new Intl.Collator();
tabs.sort((a, b) => collator.compare(a.title, b.title));

const template = document.getElementById("li_template");
const blocked_sites = new Set();
const elements = new Set();

for (const tab of tabs) {
  const element = template.content.firstElementChild.cloneNode(true);

  const title = tab.title.split("-")[0].trim();
  const pathname = new URL(tab.url).pathname.slice("/docs".length);

  element.querySelector(".title").textContent = title;
  element.querySelector(".pathname").textContent = pathname;
  element.querySelector("a").addEventListener("click", async () => {
    // need to focus window as well as the active tab
    await chrome.tabs.update(tab.id, { active: true });
    await chrome.windows.update(tab.windowId, { focused: true });
  });

  elements.add(element);
}
document.querySelector("ul").append(...elements);

const button = document.querySelector("button");
button.addEventListener("click", async () => {
  const tabIds = tabs.map(({ id }) => id);
  const group = await chrome.tabs.group({ tabIds });
  await chrome.tabGroups.update(group, { title: "DOCS" });
});

const block_button = document.querySelector("block");
block_button.addEventListener("click", async () => {
  const template = document.getElementById("li_template");

  // const form = document.querySelector('form');
  const blocked = document.getElementById('apivalue').value;
  const element = template.content.firstElementChild.cloneNode(true);
  element.querySelector(".title").textContent = blocked;
  element.querySelector(".pathname").textContent = blocked;
  element.querySelector("a").addEventListener("click", async () => {
    // need to focus window as well as the active tab
    
  });
  document.querySelector("ul").append(...element);
  await chrome.windows.update(tab.windowId, { focused: true });

});