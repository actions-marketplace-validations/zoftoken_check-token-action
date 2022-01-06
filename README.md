# ZofToken validation Github Action

When any form of Continuous Deployment is used for making changes to production environments (a classic example would be deploying a release to a live service) it's important to ensure that this is not done by error or without proper authorization.

The usual way to handle this is at the project/repository level, by only having specific users allowed to commit or merge changes to critical branches. While this approach works in general, there might be situations where this type of control is hard to implement for people outside of the development groups (for example, business owners rarely have the tools/knowledge to be part of this cycle) or a more stringent approach is required or desirable because of security policies, compliance processes or audit requirements.

This Github Action promotes a different approach and allows for the integration of [ZofToken](https://www.zoftoken.com/) right in the middle of a build/deploy pipeline. Note that this can be used in addition to branch protection (as a form of 2FA for additional security or specific requirements) or even when branch protection is unavailable or undesirable.

The [ZofToken as a Service (ZaaS)](https://zaas.zoftoken.com/) cloud implementation of ZofToken provides a free-forever tier of up to 20 tokens which can be used with this Action, enabling both technical tests or actual use cases for some organizations.

## Inputs

## `zoftoken-instance`

**Required** The API endpoint for ZofToken operations - it defaults to the ZaaS provided endpoint so any token created on ZaaS will work without including this parameter.

## `service`

**Required** The service the token belongs to.

## `id`

**Required** The token id.

## `auth-key`

**Required** The authentication key needed to access the id/service combination (in the case of ZaaS, you can use the "Basic Auth" shown on the "My Services" page).

## Example usage

```
uses: zoftoken/check-token-action@v1
with:
  service: yourcompany_compliance_tokens
  id: joe_business_owner
  auth-key: ${{ secrets.AUTHKEY }}
```

In this case a subscription called "yourcompany" was created in ZaaS, with a service called "compliance_tokens" and one token was created and enrolled for "joe_business_owner". Joe potentially has no idea what Continuous Deployment or a repository branch even is, but now has an app in his phone that prevents deployments of the service he owns without him actually providing an active, documented (in the Github Actions logs) and auditable authorization.