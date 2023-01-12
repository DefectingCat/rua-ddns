import { readConfig, validateConfig } from './utils/config';

readConfig().then((config) => {
    const result = validateConfig(config);
    if (result) console.log(result.valid);
});
