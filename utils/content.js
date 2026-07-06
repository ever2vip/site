const ContentBlock = require('../models/ContentBlock');
const SiteSetting = require('../models/SiteSetting');

async function getContentMap() {
  const blocks = await ContentBlock.find().lean();
  return blocks.reduce((acc, item) => {
    acc[item.key] = item.value;
    return acc;
  }, {});
}

async function getSettingsMap() {
  const settings = await SiteSetting.find().lean();
  return settings.reduce((acc, item) => {
    acc[item.key] = item.value;
    return acc;
  }, {});
}

module.exports = { getContentMap, getSettingsMap };
