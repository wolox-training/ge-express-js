const { config: Config } = require('../models');

exports.setConfigVariable = (key, value) => Config.upsert({ key, value });

exports.getConfigValue = key => Config.findOne({ where: { key } });
