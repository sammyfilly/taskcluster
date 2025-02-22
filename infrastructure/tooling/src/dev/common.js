module.exports = ({ userConfig, prompts, configTmpl }) => {

  prompts.push({
    type: 'input',
    when: () => !userConfig.rootUrl,
    name: 'rootUrl',
    message: 'What is the root url you will use for this deployment?',
    filter: rootUrl => {
      if (!rootUrl.includes('://')) {
        rootUrl = 'https://' + rootUrl;
      }
      return rootUrl;
    },
    validate: rootUrl => {
      if (rootUrl.endsWith('/')) {
        return 'root url must not have trailing slash';
      }

      let url;
      try {
        url = new URL(rootUrl);
      } catch (err) {
        return `${rootUrl} is not a valid URL`;
      }
      if (url.protocol !== 'https:') {
        return 'root url must be https';
      }
      return true;
    },
  });

  prompts.push({
    type: 'input',
    when: () => !userConfig.applicationName,
    // this config was renamed, so help the user out with a default
    default: userConfig.ui && userConfig.ui.application_name,
    name: 'applicationName',
    message: 'What human-readable name will your deployment have?',
  });

  prompts.push({
    when: () => !userConfig.meta?.deploymentPrefix,
    type: 'input',
    name: 'meta.deploymentPrefix',
    message: 'Specify a prefix to use for most resources needed by this deployment.',
    validate: prefix => {
      if (!/^[a-z0-9]+$/.test(prefix)) {
        return 'Must consist of lowercase characters and numbers';
      }
      if (prefix.length > 24 || prefix.length < 3) {
        return 'Must be between 3 and 24 characters in length';
      }
      return true;
    },
  });

  prompts.push({
    when: () => !userConfig.ingressType,
    type: 'input',
    name: 'ingressType',
    message: 'Leave blank if GLB is used, otherwise use "nginx" for ingress nginx type',
    validate: ingressType => {
      if (ingressType !== '' && ingressType !== 'nginx') {
        return 'Must be either empty string or "nginx"';
      }
      return true;
    },
  });

  prompts.push({
    when: () => !userConfig.ingressStaticIpName && userConfig.ingressType !== "nginx",
    type: 'input',
    name: 'ingressStaticIpName',
    message: 'Name of the google reserved static ip for this deployment. Or empty if ingress nginx is used.',
  });

  prompts.push({
    when: () => !userConfig.ingressCertName && userConfig.ingressType !== "nginx",
    type: 'input',
    name: 'ingressCertName',
    message: 'Name of the google cert for your cluster. Or empty if cert-manager is used.',
  });

  prompts.push({
    when: () => !userConfig.ingressTlsSecretName,
    type: 'input',
    name: 'ingressTlsSecretName',
    message: 'Name of the secret where cert-manager will store letsencrypt certificates, i.e. "my-tc-cert". Leave blank if cert-manager is not used.',
  });

  prompts.push({
    when: () => !userConfig.certManagerClusterIssuerName,
    type: 'input',
    name: 'certManagerClusterIssuerName',
    message: 'Name of cert-manager\'s cluster issuer, if used, i.e. "letsencrypt-prod". Leave blank if cert-manager is not used.',
  });

  prompts.push({
    when: () => !userConfig.notify || !userConfig.notify.email_source_address,
    type: 'input',
    name: 'notify.email_source_address',
    message: 'Email address for notifications to come from (must set up ses manually)',
  });
};
