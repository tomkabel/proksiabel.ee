import { Helmet } from '@dr.pogodin/react-helmet';

const guideUrl = 'https://proksiabel.ee/guides/kubernetes-security-hardening';

const techArticleSchema = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline: 'Kubernetes Security Best Practices: A Hardening Checklist',
  description:
    'Kubernetes security best practices in checklist form: RBAC least privilege, Pod Security Standards enforcement, seccomp, default-deny NetworkPolicies, control-plane and kubelet hardening, image supply-chain controls, and kube-bench verification — with copy-paste YAML and expected outputs.',
  datePublished: '2026-09-07',
  dateModified: '2026-09-07',
  inLanguage: 'en',
  mainEntityOfPage: guideUrl,
  author: {
    '@type': 'Organization',
    name: 'ProksiAbel OÜ',
    url: 'https://proksiabel.ee/',
  },
  publisher: {
    '@type': 'Organization',
    name: 'ProksiAbel OÜ',
    url: 'https://proksiabel.ee/',
  },
};

export default function KubernetesHardeningGuide() {
  return (
    <>
      <Helmet>
        <script type='application/ld+json'>{JSON.stringify(techArticleSchema)}</script>
      </Helmet>

      <div className='min-h-screen bg-slate-900 pt-24 pb-12'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
          <p className='text-sm uppercase tracking-wide text-sky-400 font-semibold mb-4'>
            Technical Guide
          </p>
          <h1 className='text-3xl md:text-4xl font-bold text-white mb-6'>
            Kubernetes Security Best Practices: A Hardening Checklist
          </h1>
          <p className='text-slate-400 text-lg leading-relaxed mb-10'>
            Hardening Kubernetes is a small set of enforceable controls, not a checklist of hundreds
            of flags: RBAC least privilege, Pod Security Standards (restricted where possible),
            seccomp and non-root workloads, default-deny NetworkPolicies, a locked-down API server,
            and image provenance gates. This guide gives you the controls in deployment order, the
            YAML to apply, the commands that prove each one works, and the realistic cost of every
            control.
          </p>

          <div className='max-w-none text-slate-300'>
            <section className='mb-10'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>
                Why default clusters are a liability
              </h2>
              <p className='leading-relaxed mb-4'>
                Kubernetes is secure by configuration, not by default. The API server is the only
                component that must authenticate callers, and most of the defaults that bite later
                are permissive on purpose so that a fresh cluster is easy to operate: pods may run
                privileged and as root, any pod can reach any other pod, every namespace&apos;s
                default service account carries a token that can talk to the API, and RBAC objects
                are only as good as the least-privilege discipline applied to them. The Kubernetes
                project&apos;s own RBAC good-practices page states it plainly: RBAC is &quot;a key
                security control to ensure that cluster users and workloads have only the access to
                resources required to execute their roles.&quot;
              </p>
              <p className='leading-relaxed mb-4'>
                The consequence of permissive defaults is that a single foothold becomes cluster
                compromise. The attack chains that dominate Kubernetes incidents follow a consistent
                shape:
              </p>
              <div className='overflow-x-auto mb-4'>
                <table className='w-full text-sm text-left border-collapse'>
                  <thead>
                    <tr className='border-b border-slate-700'>
                      <th className='py-3 pr-4 text-slate-100 font-semibold'>Attack vector</th>
                      <th className='py-3 pr-4 text-slate-100 font-semibold'>Default posture</th>
                      <th className='py-3 text-slate-100 font-semibold'>
                        Control (section in this guide)
                      </th>
                    </tr>
                  </thead>
                  <tbody className='text-slate-300'>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>Exposed or weak API server access</td>
                      <td className='py-3 pr-4 align-top'>
                        Anonymous access allowed unless explicitly disabled; authorization must be
                        switched from AlwaysAllow to RBAC
                      </td>
                      <td className='py-3 align-top'>Control plane (P0)</td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>
                        Stolen or over-privileged service account token
                      </td>
                      <td className='py-3 pr-4 align-top'>
                        Default service account token auto-mounted into every pod; broad Roles and
                        ClusterRoles are common
                      </td>
                      <td className='py-3 align-top'>RBAC (P0)</td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>Container escape or privileged pod</td>
                      <td className='py-3 pr-4 align-top'>
                        No admission policy: privileged, hostPID/hostNetwork, root, and missing
                        seccomp all permitted
                      </td>
                      <td className='py-3 align-top'>Pod security (P0)</td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>Lateral movement inside the cluster</td>
                      <td className='py-3 pr-4 align-top'>
                        No isolation: every pod can reach every pod and the Kubernetes DNS service
                      </td>
                      <td className='py-3 align-top'>NetworkPolicy (P1)</td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>Compromised or malicious image</td>
                      <td className='py-3 pr-4 align-top'>
                        Images pulled by mutable tag, unscanned, unsigned; secrets readable from the
                        image layer or the pod
                      </td>
                      <td className='py-3 align-top'>Supply chain (P1)</td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>Vulnerable cluster component</td>
                      <td className='py-3 pr-4 align-top'>
                        Add-on and control-plane versions drift from supported track
                      </td>
                      <td className='py-3 align-top'>Baseline hygiene</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className='leading-relaxed mb-4'>
                These are not theoretical. IngressNightmare (CVE-2025-1974 and related CVEs,
                disclosed March 2025) was a critical remote code execution in the ingress-nginx
                add-on that shipped with many clusters; unauthenticated exploitation of a
                misconfigured admission webhook configuration gave attackers code execution inside
                cluster pods. It was fixed in ingress-nginx 1.12.1 and 1.11.5, and was exploited in
                the wild — exactly the pattern the NSA/CISA <em>Kubernetes Hardening Guidance</em>{' '}
                (first released 2021, updated 2022, now at version 1.2) and the CIS Kubernetes
                Benchmark exist to stop: an attacker who reaches one pod should not inherit the
                cluster.
              </p>
              <p className='leading-relaxed mb-4'>
                Two reference documents define the target state. The{' '}
                <strong className='text-slate-100'>CIS Kubernetes Benchmark</strong> is a scored,
                versioned control set for control-plane components, etcd, worker nodes, and cluster
                policy; kube-bench automates it. The{' '}
                <strong className='text-slate-100'>NSA/CISA guidance</strong> adds threat-model
                framing and container-specific controls (non-root, read-only root filesystems,
                resource limits). NIST SP 800-190 provides the container-security foundation beneath
                both. This guide maps controls to all three, and each control below names its
                verification command — a control you cannot verify is a belief, not a control.
              </p>
            </section>

            <section className='mb-10'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>
                The P0-P2 hardening checklist
              </h2>
              <p className='leading-relaxed mb-4'>
                Work in priority order. P0 items stop the cluster-compromise chains above and are
                cheap. P1 items contain blast radius. P2 items are hygiene that prevents slow-burn
                exposure. Each row maps to the section that shows the exact configuration and
                verification.
              </p>
              <div className='overflow-x-auto mb-4'>
                <table className='w-full text-sm text-left border-collapse'>
                  <thead>
                    <tr className='border-b border-slate-700'>
                      <th className='py-3 pr-4 text-slate-100 font-semibold'>Priority</th>
                      <th className='py-3 pr-4 text-slate-100 font-semibold'>Control</th>
                      <th className='py-3 pr-4 text-slate-100 font-semibold'>Verify with</th>
                      <th className='py-3 text-slate-100 font-semibold'>Section</th>
                    </tr>
                  </thead>
                  <tbody className='text-slate-300'>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>P0</td>
                      <td className='py-3 pr-4 align-top'>
                        Disable anonymous access; enforce RBAC authorization on API server and
                        kubelet
                      </td>
                      <td className='py-3 pr-4 align-top'>
                        kube-bench; unauthenticated API probe returns 401
                      </td>
                      <td className='py-3 align-top'>Control plane</td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>P0</td>
                      <td className='py-3 pr-4 align-top'>
                        Encrypt secrets at rest (EncryptionConfiguration)
                      </td>
                      <td className='py-3 pr-4 align-top'>etcdctl read shows ciphertext prefix</td>
                      <td className='py-3 align-top'>Control plane</td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>P0</td>
                      <td className='py-3 pr-4 align-top'>
                        No auto-mounted default service account tokens; RBAC least privilege per
                        namespace
                      </td>
                      <td className='py-3 pr-4 align-top'>
                        kubectl auth can-i; inspect role bindings
                      </td>
                      <td className='py-3 align-top'>RBAC</td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>P0</td>
                      <td className='py-3 pr-4 align-top'>
                        Enforce Pod Security Standards on namespaces (baseline minimum, restricted
                        for app workloads)
                      </td>
                      <td className='py-3 pr-4 align-top'>
                        kubectl apply of a violating pod is rejected
                      </td>
                      <td className='py-3 align-top'>Pod security</td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>P0</td>
                      <td className='py-3 pr-4 align-top'>
                        Run workloads non-root with seccomp RuntimeDefault and no privilege
                        escalation
                      </td>
                      <td className='py-3 pr-4 align-top'>
                        Pod spec inspection; kube-bench policy checks
                      </td>
                      <td className='py-3 align-top'>Pod security</td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>P1</td>
                      <td className='py-3 pr-4 align-top'>
                        Default-deny ingress and egress NetworkPolicies per namespace
                      </td>
                      <td className='py-3 pr-4 align-top'>
                        kubectl get networkpolicies; connectivity probe
                      </td>
                      <td className='py-3 align-top'>Network</td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>P1</td>
                      <td className='py-3 pr-4 align-top'>
                        Image scanning gate, digest-pinned immutable images, signature verification
                      </td>
                      <td className='py-3 pr-4 align-top'>
                        trivy image --exit-code; cosign verify
                      </td>
                      <td className='py-3 align-top'>Supply chain</td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>P1</td>
                      <td className='py-3 pr-4 align-top'>
                        Read-only root filesystem, resource limits on pods
                      </td>
                      <td className='py-3 pr-4 align-top'>Pod spec; kube-bench</td>
                      <td className='py-3 align-top'>Pod security</td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>P2</td>
                      <td className='py-3 pr-4 align-top'>
                        Scheduled kube-bench / Trivy Operator scans with tracked exceptions
                      </td>
                      <td className='py-3 pr-4 align-top'>Scan job results in CI or cluster</td>
                      <td className='py-3 align-top'>Verification</td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>P2</td>
                      <td className='py-3 pr-4 align-top'>
                        Kubernetes and add-on versions on a supported track; audit logging enabled
                        and retained
                      </td>
                      <td className='py-3 pr-4 align-top'>
                        kubectl version; audit policy inspection
                      </td>
                      <td className='py-3 align-top'>Baseline hygiene</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className='leading-relaxed mb-4'>
                A note on managed clusters (EKS, AKS, GKE): control-plane checks for components the
                provider operates (API server flags, etcd) are the provider&apos;s responsibility.
                kube-bench ships platform profiles (EKS, GKE, AKS) that run the applicable subset,
                and the CIS EKS Benchmark is versioned separately from the generic CIS Kubernetes
                Benchmark. Run those profiles instead of the generic one, and focus your effort on
                the workload-side controls, which are always yours.
              </p>
            </section>

            <section className='mb-10'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>
                P0: Control plane — API server, kubelet, secrets at rest
              </h2>
              <p className='leading-relaxed mb-4'>
                The API server is the front door to every secret and every control plane capability.
                The three non-negotiable settings, all present in the CIS Kubernetes Benchmark
                control-plane section: no anonymous access, RBAC (not AlwaysAllow) as the
                authorization mode, and all component communication over TLS with verified client
                certificates. kubeadm clusters render these as static pod manifests under{' '}
                <code className='text-slate-100'>/etc/kubernetes/manifests/</code>; the same flags
                belong in your kube-apiserver invocation on any installer.
              </p>
              <h3 className='text-lg text-sky-400 font-medium mb-3'>
                Default-insecure vs hardened kube-apiserver flags
              </h3>
              <pre className='bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4'>
                {`# default-insecure (or silently absent):
#   --anonymous-auth=true (default)  -> unauthenticated requests reach RBAC
#   --authorization-mode=AlwaysAllow -> any authenticated caller may do anything
#   --encryption-provider-config=    -> secrets stored as plaintext in etcd

# hardened: add to kube-apiserver (kubeadm: /etc/kubernetes/manifests/kube-apiserver.yaml)
--anonymous-auth=false
--authorization-mode=Node,RBAC
--service-account-lookup=true        # default; keeps deleted SA tokens unusable
--enable-admission-plugins=NodeRestriction
--encryption-provider-config=/etc/kubernetes/encryption/encryption-config.yaml
--audit-log-path=/var/log/kubernetes/audit.log
--audit-log-maxage=30
--audit-policy-file=/etc/kubernetes/audit/audit-policy.yaml`}
              </pre>
              <p className='leading-relaxed mb-4'>
                Verify each setting the way an attacker would — anonymously, from outside:
              </p>
              <pre className='bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4'>
                {`$ curl -sk https://<api-server>:6443/version
Unauthorized                    # <-- anonymous auth disabled: good
# (before the fix this returns the version JSON with no credentials)

# confirm the effective flags on the running process:
$ ps -ef | grep kube-apiserver | tr ' ' '\\n' | grep -E 'anonymous-auth|authorization-mode'`}
              </pre>
              <p className='leading-relaxed mb-4'>
                Anonymous access exists so health probes and discovery can work without credentials;
                the CIS-correct posture is to disable it and make every caller authenticate. If a
                component genuinely needs unauthenticated access (for example an external
                health-check), scope it with an RBAC Role/ClusterRole bound to{' '}
                <code className='text-slate-100'>system:unauthenticated</code> instead of leaving
                the door open.
              </p>

              <h3 className='text-lg text-sky-400 font-medium mb-3'>
                Secrets at rest: EncryptionConfiguration
              </h3>
              <p className='leading-relaxed mb-4'>
                By default Kubernetes stores Secret objects as plaintext in etcd. Anyone who reads
                etcd — a backup file, a snapshot, a compromised etcd pod — reads every secret.
                Encryption at rest fixes that at the API server, which encrypts before writing:
              </p>
              <pre className='bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4'>
                {`# /etc/kubernetes/encryption/encryption-config.yaml
apiVersion: apiserver.config.k8s.io/v1
kind: EncryptionConfiguration
resources:
  - resources:
      - secrets
    providers:
      - aescbc:
          keys:
            - name: key1
              # 32 random bytes, base64-encoded:
              # openssl rand -base64 32
              secret: <base64 32-byte key>
      - identity: {}   # MUST be last: lets the API server read legacy plaintext once`}
              </pre>
              <p className='leading-relaxed mb-4'>
                Restart the API server with{' '}
                <code className='text-slate-100'>--encryption-provider-config</code> pointed at the
                file, then re-create existing secrets so they are rewritten encrypted (encryption
                applies on write; existing secrets stay plaintext until rewritten). Verify by
                reading etcd directly — the value must carry the provider prefix:
              </p>
              <pre className='bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4'>
                {`$ ETCDCTL_API=3 etcdctl --endpoints=https://127.0.0.1:2379 \\
    --cacert=/etc/kubernetes/pki/etcd/ca.crt \\
    --cert=/etc/kubernetes/pki/etcd/server.crt \\
    --key=/etc/kubernetes/pki/etcd/server.key \\
    get /registry/secrets/default/my-secret | head -1
k8s:enc:aescbc:v1:key1:2V7i1bU...   # ciphertext prefix: encrypted
# a plaintext value here (no k8s:enc: prefix) means encryption is NOT active`}
              </pre>
              <p className='leading-relaxed mb-4'>
                For production, prefer a KMS provider (cloud KMS or a local KMS like Vault) over a
                raw aescbc key in a file: KMS moves key management out of the control plane and
                supports key rotation without restart. Whatever the provider, protect the encryption
                key file with the same discipline as the etcd CA — anyone with the key and an etcd
                snapshot can decrypt.
              </p>

              <h3 className='text-lg text-sky-400 font-medium mb-3'>
                Kubelet: authenticate and authorize every node request
              </h3>
              <p className='leading-relaxed mb-4'>
                The kubelet listens on port 10250 and can execute commands in pods, read pod
                secrets, and drain nodes. CIS worker-node checks require the kubelet to reject
                anonymous requests and to authorize via the API server (Webhook), never AlwaysAllow.
                kubeadm clusters configure this in the kubelet config file:
              </p>
              <pre className='bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4'>
                {`# /var/lib/kubelet/config.yaml (KubeletConfiguration)
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
authentication:
  anonymous:
    enabled: false
  webhook:
    enabled: true
authorization:
  mode: Webhook
protectKernelDefaults: true
seccompDefault: true          # apply RuntimeDefault to pods that set no profile
rotateCertificates: true`}
              </pre>
              <p className='leading-relaxed mb-4'>
                <code className='text-slate-100'>protectKernelDefaults: true</code> makes the
                kubelet refuse to start if kernel hardening parameters (such as{' '}
                <code className='text-slate-100'>vm.overcommit_memory</code>,{' '}
                <code className='text-slate-100'>kernel.panic</code>, and{' '}
                <code className='text-slate-100'>kernel.panic_on_oops</code>) are not set, closing
                the sysctl-tuning path to host compromise. The kubelet also needs{' '}
                <code className='text-slate-100'>--node-labels</code> and TLS serving on 10250 only;
                a node with an open read-only port (legacy 10255 in older releases) is a recon gift
                — check that nothing listens on it.
              </p>
            </section>

            <section className='mb-10'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>
                P0: RBAC — least privilege for humans and workloads
              </h2>
              <p className='leading-relaxed mb-4'>
                The Kubernetes RBAC good-practices documentation is unambiguous about the failure
                modes that matter: giving a principal <code className='text-slate-100'>list</code>{' '}
                or <code className='text-slate-100'>watch</code> on Secrets is equivalent to giving{' '}
                <code className='text-slate-100'>get</code> (the list response includes secret
                contents); permission to create workloads implicitly grants access to the Secrets,
                ConfigMaps, and PersistentVolumes those pods can mount, plus the API access of any
                service account in the namespace; and membership in{' '}
                <code className='text-slate-100'>system:masters</code> bypasses RBAC entirely and
                cannot be revoked by removing bindings. Membership of{' '}
                <code className='text-slate-100'>system:unauthenticated</code> should be reviewed
                and removed — it grants anyone who can reach the API server network-wise whatever
                rights the binding carries.
              </p>
              <h3 className='text-lg text-sky-400 font-medium mb-3'>
                Namespace-scoped roles instead of cluster-admin for humans
              </h3>
              <pre className='bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4'>
                {`# Role: scoped to one namespace, no wildcards, no secrets
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: payments
  name: payments-operator
rules:
  - apiGroups: [""]
    resources: ["pods", "pods/log", "services", "configmaps"]
    verbs: ["get", "list", "watch"]
  - apiGroups: ["apps"]
    resources: ["deployments", "statefulsets"]
    verbs: ["get", "list", "watch", "create", "update", "patch"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  namespace: payments
  name: payments-operator
subjects:
  - kind: User
    name: alice@example.com    # from your IdP mapping
    apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: Role
  name: payments-operator
  apiGroup: rbac.authorization.k8s.io`}
              </pre>
              <p className='leading-relaxed mb-4'>
                Verify least privilege by asking the API what a principal can actually do, and by
                listing who holds the crown jewels:
              </p>
              <pre className='bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4'>
                {`# what can this user do in this namespace?
$ kubectl auth can-i --list --namespace payments --as alice@example.com

# who holds cluster-admin today? (system: default bindings + YOUR additions)
$ kubectl get clusterrolebindings.rbac.authorization.k8s.io -o custom-columns=NAME:.metadata.name,SUBJECTS:.subjects[*].name | grep -i cluster-admin

# which service accounts can read secrets anywhere?
$ kubectl get clusterrolebindings.rbac.authorization.k8s.io -o json \\
    | jq -r '.items[] | select(.roleRef.name=="cluster-admin" or .roleRef.name=="view") | .metadata.name'`}
              </pre>

              <h3 className='text-lg text-sky-400 font-medium mb-3'>
                Stop auto-mounting the default service account token
              </h3>
              <p className='leading-relaxed mb-4'>
                Every pod that does not opt out gets the namespace&apos;s default service account
                token mounted at{' '}
                <code className='text-slate-100'>
                  /var/run/secrets/kubernetes.io/serviceaccount/
                </code>
                . If that service account carries broad rights, any code execution in the pod is a
                step toward cluster admin. Two changes: disable auto-mount on the default service
                account (opt-in per pod), and keep the token off pods that never call the API.
              </p>
              <pre className='bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4'>
                {`# one-time per namespace: default SA no longer auto-mounts a token
$ kubectl patch serviceaccount default -n payments -p '{"automountServiceAccountToken": false}'

# or per pod (this also belongs in the hardened Deployment template in the next section):
# spec:
#   automountServiceAccountToken: false

# list namespaces where the default SA still auto-mounts:
$ kubectl get serviceaccounts -A -o json | jq -r '.items[] | select(.automountServiceAccountToken != false) | .metadata.namespace + "/" + .metadata.name'`}
              </pre>
              <p className='leading-relaxed mb-4'>
                Workloads that do need the API get a dedicated service account with a Role granting
                only the operations they perform — the standard pattern is one service account per
                workload, bound to a namespace Role, never to cluster-admin. Human break-glass
                access can be impersonation-based: keep a low-privilege account that can{' '}
                <code className='text-slate-100'>impersonate</code> a named admin role, so actions
                are attributable and no standing superuser credential exists.
              </p>
            </section>

            <section className='mb-10'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>
                P0: Pod security — standards, seccomp, non-root, no privilege escalation
              </h2>
              <p className='leading-relaxed mb-4'>
                Pod Security Standards (PSS) define three cumulative policy levels. The Kubernetes
                documentation describes them exactly:{' '}
                <strong className='text-slate-100'>Privileged</strong> is &quot;unrestricted,&quot;{' '}
                <strong className='text-slate-100'>Baseline</strong> is &quot;minimally
                restrictive&quot; and prevents known privilege escalations, and{' '}
                <strong className='text-slate-100'>Restricted</strong> is &quot;heavily
                restricted,&quot; following current pod hardening best practices. Enforcement is
                built in: the Pod Security Admission controller (stable since Kubernetes v1.25)
                evaluates every pod creation against the level configured on its namespace.
              </p>
              <div className='overflow-x-auto mb-4'>
                <table className='w-full text-sm text-left border-collapse'>
                  <thead>
                    <tr className='border-b border-slate-700'>
                      <th className='py-3 pr-4 text-slate-100 font-semibold'>Requirement</th>
                      <th className='py-3 pr-4 text-slate-100 font-semibold'>Baseline</th>
                      <th className='py-3 text-slate-100 font-semibold'>Restricted adds</th>
                    </tr>
                  </thead>
                  <tbody className='text-slate-300'>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>Privileged containers</td>
                      <td className='py-3 pr-4 align-top'>Forbidden</td>
                      <td className='py-3 align-top'>(inherits baseline)</td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>Host namespaces (network, PID, IPC)</td>
                      <td className='py-3 pr-4 align-top'>Forbidden</td>
                      <td className='py-3 align-top'>(inherits baseline)</td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>Added Linux capabilities</td>
                      <td className='py-3 pr-4 align-top'>Restricted to a small default set</td>
                      <td className='py-3 align-top'>
                        Must drop ALL; may add back only NET_BIND_SERVICE
                      </td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>hostPath volumes</td>
                      <td className='py-3 pr-4 align-top'>Forbidden</td>
                      <td className='py-3 align-top'>(inherits baseline)</td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>allowPrivilegeEscalation</td>
                      <td className='py-3 pr-4 align-top'>—</td>
                      <td className='py-3 align-top'>Must be false</td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>Root execution</td>
                      <td className='py-3 pr-4 align-top'>—</td>
                      <td className='py-3 align-top'>
                        runAsNonRoot must be true; runAsUser may not be 0
                      </td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>seccomp profile</td>
                      <td className='py-3 pr-4 align-top'>—</td>
                      <td className='py-3 align-top'>
                        Must be RuntimeDefault or Localhost — Unconfined and absent are rejected
                      </td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>Volume types</td>
                      <td className='py-3 pr-4 align-top'>—</td>
                      <td className='py-3 align-top'>
                        Restricted allowlist (no hostPath, no projected host paths)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <h3 className='text-lg text-sky-400 font-medium mb-3'>
                Roll out with warn and audit before enforce
              </h3>
              <p className='leading-relaxed mb-4'>
                The admission controller supports three modes per namespace — enforce (reject),
                audit (annotate the audit log), and warn (warn the caller). The safe rollout is:
                label with warn and audit first, fix the workloads that surface, then flip to
                enforce. Pin a version label so policy behavior does not drift silently across
                Kubernetes upgrades.
              </p>
              <pre className='bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4'>
                {`# step 1: observe (audit + warn) for a cycle
$ kubectl label ns payments \\
    pod-security.kubernetes.io/audit=restricted \\
    pod-security.kubernetes.io/warn=restricted

# step 2: enforce once workloads comply
$ kubectl label ns payments \\
    pod-security.kubernetes.io/enforce=restricted \\
    pod-security.kubernetes.io/enforce-version=v1.31 --overwrite

# see the configured level per namespace
$ kubectl get ns -l pod-security.kubernetes.io/enforce -o custom-columns=NS:.metadata.name,ENFORCE:.metadata.labels.pod-security.kubernetes.io/enforce`}
              </pre>
              <h3 className='text-lg text-sky-400 font-medium mb-3'>
                The restricted-compliant pod template
              </h3>
              <pre className='bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4'>
                {`apiVersion: apps/v1
kind: Deployment
metadata:
  name: payments-api
  namespace: payments
spec:
  replicas: 3
  selector:
    matchLabels:
      app: payments-api
  template:
    metadata:
      labels:
        app: payments-api
    spec:
      automountServiceAccountToken: false   # no API access needed
      securityContext:
        runAsNonRoot: true                  # image must not run as root
        seccompProfile:
          type: RuntimeDefault              # container runtime's default profile
      containers:
        - name: api
          image: registry.example.com/payments/api@sha256:9f3c...  # pinned digest
          securityContext:
            allowPrivilegeEscalation: false
            readOnlyRootFilesystem: true
            capabilities:
              drop: ["ALL"]
              add: ["NET_BIND_SERVICE"]     # bind :8443 as non-root
            runAsNonRoot: true
            runAsUser: 65532                # or the image's declared non-root USER
          resources:                        # hard limits: NSA/CISA guidance
            requests:
              cpu: 100m
              memory: 128Mi
            limits:
              cpu: 500m
              memory: 512Mi
          volumeMounts:
            - name: tmp
              mountPath: /tmp
          ports:
            - containerPort: 8443
      volumes:
        - name: tmp
          emptyDir: {}`}
              </pre>
              <p className='leading-relaxed mb-4'>
                This template passes the Restricted profile: non-root, privilege escalation off, all
                capabilities dropped, seccomp explicitly RuntimeDefault, read-only root filesystem,
                and no auto-mounted token. Note the trade-offs baked in:{' '}
                <code className='text-slate-100'>readOnlyRootFilesystem: true</code> breaks any
                application that writes to its own image — mount emptyDir volumes at the writable
                paths (/tmp, /var/run, cache directories), and images that run as root must be
                rebuilt with a non-root USER before they can pass.
              </p>
              <p className='leading-relaxed mb-4'>
                Verify enforcement by attempting to create a violating pod:
              </p>
              <pre className='bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4'>
                {`$ kubectl -n payments run nginx-privileged --image=nginx \\
    --restart=Never --overrides='{"spec":{"containers":[{"name":"p","image":"nginx","securityContext":{"privileged":true}}]}}'
Error from server (Forbidden): pods "nginx-privileged" is forbidden: violates PodSecurity "restricted:v1.31": privileged (container "p" must not set securityContext.privileged=true)
# (example output — the exact wording tracks your policy level and version)`}
              </pre>
              <p className='leading-relaxed mb-4'>
                Seccomp is the control that limits what a container can do even after code
                execution, and it is the one most often missing. Since Kubernetes 1.19 the seccomp
                profile field is stable; setting{' '}
                <code className='text-slate-100'>RuntimeDefault</code> applies the container
                runtime&apos;s default allowlist (which blocks the exotic syscalls that container
                escapes rely on), and the kubelet{' '}
                <code className='text-slate-100'>seccompDefault: true</code> option (GA since
                Kubernetes 1.27) applies it to every pod that does not specify a profile. Privileged
                containers always run as Unconfined — seccomp cannot be applied to them, which is
                one more reason the Restricted profile forbids privileged.
              </p>
            </section>

            <section className='mb-10'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>
                P1: NetworkPolicy — default deny, then allow what is necessary
              </h2>
              <p className='leading-relaxed mb-4'>
                Kubernetes network policy semantics reward a deny-first mindset: a pod is
                non-isolated (all traffic allowed) until a NetworkPolicy selects it, and policies
                are additive — the allowed set is the union of all matching policies. The Kubernetes
                documentation is explicit that policies apply to a connection only if <em>both</em>{' '}
                ends allow it: egress policy on the source pod and ingress policy on the destination
                pod must both permit the connection. Reply traffic for allowed connections is
                implicitly allowed, and traffic between a pod and its own node is always allowed.
              </p>
              <p className='leading-relaxed mb-4'>
                Two prerequisites are worth stating before any YAML: a network plugin that
                implements NetworkPolicy enforcement (Calico, Cilium, OVN-Kubernetes, and the major
                managed offerings) is required — creating NetworkPolicy resources without a
                supporting plugin has no effect. And default-deny changes nothing you can see in a
                dashboard; it changes what works.
              </p>
              <h3 className='text-lg text-sky-400 font-medium mb-3'>
                Default-deny for the namespace
              </h3>
              <pre className='bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4'>
                {`# deny-all.yaml — apply once per namespace you protect
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny
  namespace: payments
spec:
  podSelector: {}          # selects all pods in the namespace
  policyTypes:
    - Ingress
    - Egress`}
              </pre>
              <h3 className='text-lg text-sky-400 font-medium mb-3'>
                Then allow the real paths: web to api, api to db, api to DNS
              </h3>
              <pre className='bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4'>
                {`# allow-ingress-to-api.yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-web-to-api
  namespace: payments
spec:
  podSelector:
    matchLabels:
      app: payments-api
  policyTypes: [Ingress]
  ingress:
    - from:
        - podSelector:
            matchLabels:
              app: payments-web
      ports:
        - protocol: TCP
          port: 8443
---
# allow-egress-from-api.yaml — DNS (kube-system kube-dns) + the DB port only
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-api-egress
  namespace: payments
spec:
  podSelector:
    matchLabels:
      app: payments-api
  policyTypes: [Egress]
  egress:
    - to:
        - namespaceSelector: {}
          podSelector:
            matchLabels:
              k8s-app: kube-dns
      ports:
        - protocol: UDP
          port: 53
        - protocol: TCP
          port: 53
    - to:
        - podSelector:
            matchLabels:
              app: payments-db
      ports:
        - protocol: TCP
          port: 5432`}
              </pre>
              <p className='leading-relaxed mb-4'>
                The DNS egress rule is the classic operational trap: once egress is denied, pods
                that cannot reach kube-dns fail name resolution everywhere, and the error messages
                look nothing like a network policy problem. The NSA/CISA guidance and most reference
                recipes therefore always pair a default-deny egress policy with an explicit DNS
                allowance — if your CNI supports FQDN-based egress rules (Cilium does), you can
                restrict DNS itself instead of allowing the whole kube-dns service.
              </p>
              <pre className='bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4'>
                {`# verify: every protected namespace must carry the deny-all policy
$ kubectl get networkpolicies -A
NAMESPACE   NAME          POD-SELECTOR   AGE
payments    default-deny  <none>         12d

# verify behavior: exec into the web pod and try the DB port directly
$ kubectl exec -n payments deploy/payments-web -- bash -c \\
    'timeout 3 bash -c "</dev/tcp/payments-db/5432"' && echo OPEN || echo BLOCKED
BLOCKED   # expected when no policy allows web -> db:5432`}
              </pre>
            </section>

            <section className='mb-10'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>
                P1: Supply chain — scan, pin, sign
              </h2>
              <p className='leading-relaxed mb-4'>
                An image is a compressed attack surface: the base OS, every layer&apos;s packages,
                and the runtime dependencies. Three controls cover the realistic threat model: scan
                images before deploy and gate on findings, reference images by digest so a mutable
                tag can never be swapped under you, and verify signatures at admission so only
                images your pipeline signed can run.
              </p>
              <pre className='bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4'>
                {`# scan in CI: fail the build on un-fixed HIGH/CRITICAL
$ trivy image --exit-code 1 --severity HIGH,CRITICAL --ignore-unfixed \\
    registry.example.com/payments/api:1.4.2

# resolve a tag to a digest and pin it in the manifest
$ docker buildx imagetools inspect registry.example.com/payments/api:1.4.2
Digest: sha256:9f3c...  # -> use image: ...@sha256:9f3c... in the Deployment

# emit an SBOM as a build artifact (CycloneDX)
$ trivy image --format cyclonedx --output api.sbom.json \\
    registry.example.com/payments/api:1.4.2`}
              </pre>
              <p className='leading-relaxed mb-4'>
                Signing without admission enforcement is ceremony. A Kyverno or OPA Gatekeeper
                policy that requires a valid <code className='text-slate-100'>cosign</code>{' '}
                signature on every image turns the signature into a control — unsigned images are
                rejected at admission, which also stops &quot;someone pushed to the same tag&quot;
                supply-chain substitution even before digest pinning. The full implementation
                (Sigstore/cosign keys, Kyverno <code className='text-slate-100'>verifyImages</code>{' '}
                rule, registry trust policy) is its own guide, but the pattern is stable: sign in CI
                after scan, verify at admission, and never let a mutable tag into a manifest.
              </p>
            </section>

            <section className='mb-10'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>
                P2: Verify continuously — kube-bench and image scanning in the loop
              </h2>
              <p className='leading-relaxed mb-4'>
                The CIS Kubernetes Benchmark is the scored control set behind most of the checks in
                this guide, and kube-bench automates it: it inspects control-plane component flags,
                etcd configuration, kubelet settings, and cluster policy objects, and reports
                PASS/FAIL/WARN per control. It needs host access (PID namespace and config
                directories) to check running processes, so the supported pattern is a one-shot Job
                on the node:
              </p>
              <pre className='bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm text-slate-200 mb-4'>
                {`$ kubectl apply -f https://raw.githubusercontent.com/aquasecurity/kube-bench/main/job.yaml
job.batch/kube-bench created

$ kubectl logs job/kube-bench
[INFO] 1 Master Node Security Configuration
[INFO] 1.1 API Server
[PASS] 1.1.1 Ensure that the API Server pod specification file permissions are set to 644 or more restrictive
[FAIL] 1.1.12 Ensure that the API Server --anonymous-auth argument is set to false
[INFO] 2 Etcd Node Configuration
...
# (example output; section and check numbering follow your kube-bench/CIS version)`}
              </pre>
              <p className='leading-relaxed mb-4'>
                Two honest caveats. First, benchmark versions do not map one-to-one to Kubernetes
                releases — kube-bench auto-selects the test set from the detected Kubernetes
                version, and the CIS numbering scheme changed between editions (the CIS 2.0 profile
                targets Kubernetes 1.34-1.35 with its own check numbering). Always read the
                remediation text for your benchmark version rather than memorizing check numbers.
                Second, a benchmark is a floor, not a ceiling: it checks configuration, and several
                controls in this guide (default-deny NetworkPolicy coverage, secret handling, image
                signing) are checked weakly or not at all by scored benchmarks — that is why the
                P0-P2 checklist pairs each control with its own verification command.
              </p>
              <p className='leading-relaxed mb-4'>
                For continuous operation, the Trivy Operator runs kube-bench and image/vulnerability
                scans in-cluster on a schedule and reports findings as Kubernetes custom resources;
                a scheduled scan with a tracked exception list beats a heroic annual audit. Whatever
                cadence you choose, the scan results must be reviewed by a human and the exceptions
                must be dated and owned.
              </p>
            </section>

            <section className='mb-10'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>
                What breaks when you enable this
              </h2>
              <p className='leading-relaxed mb-4'>
                Every control in this guide has an operational cost. Naming it up front is what
                makes the checklist executable instead of aspirational:
              </p>
              <div className='overflow-x-auto mb-4'>
                <table className='w-full text-sm text-left border-collapse'>
                  <thead>
                    <tr className='border-b border-slate-700'>
                      <th className='py-3 pr-4 text-slate-100 font-semibold'>Control</th>
                      <th className='py-3 pr-4 text-slate-100 font-semibold'>Typical breakage</th>
                      <th className='py-3 text-slate-100 font-semibold'>Mitigation</th>
                    </tr>
                  </thead>
                  <tbody className='text-slate-300'>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>Restricted Pod Security Standards</td>
                      <td className='py-3 pr-4 align-top'>
                        Images that run as root or write to their root filesystem are rejected;
                        NET_ADMIN/SYS_PTRACE workloads break
                      </td>
                      <td className='py-3 align-top'>
                        warn/audit rollout; rebuild with non-root USER and emptyDir mounts;
                        documented baseline namespace for infrastructure pods
                      </td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>Default-deny NetworkPolicy</td>
                      <td className='py-3 pr-4 align-top'>
                        DNS resolution fails (egress to kube-dns not allowed); health checks and
                        monitoring scrapes time out; cross namespace calls break
                      </td>
                      <td className='py-3 align-top'>
                        Always pair egress deny with DNS allowance; add
                        monitoring/ingress-controller namespaces to policies before flipping
                      </td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>Seccomp RuntimeDefault</td>
                      <td className='py-3 pr-4 align-top'>
                        Workloads invoking uncommon syscalls fail at runtime
                      </td>
                      <td className='py-3 align-top'>
                        Test under RuntimeDefault early; audit-mode seccomp profiles for the rare
                        workload that needs more
                      </td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>Encryption at rest</td>
                      <td className='py-3 pr-4 align-top'>
                        Rotating the provider key requires API server restart; lost key =
                        undecryptable secrets
                      </td>
                      <td className='py-3 align-top'>
                        KMS provider with automatic key rotation; test restore from etcd snapshot in
                        staging
                      </td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>No auto-mounted SA token</td>
                      <td className='py-3 pr-4 align-top'>
                        Workloads that implicitly used the API break with 403s
                      </td>
                      <td className='py-3 align-top'>
                        Give each workload an explicit service account + Role; monitor API error
                        rates after rollout
                      </td>
                    </tr>
                    <tr className='border-b border-slate-800'>
                      <td className='py-3 pr-4 align-top'>Image scan + signature gates</td>
                      <td className='py-3 pr-4 align-top'>
                        Deploys fail on new HIGH/CVEs; unsigned hotfixes are blocked
                      </td>
                      <td className='py-3 align-top'>
                        Triage SLA for new findings; keep the signing key path in the incident
                        runbook
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className='leading-relaxed mb-4'>
                Recommended order of operations for an existing cluster: (1) close the P0
                configuration gaps on the control plane and kubelet; (2) label the highest-risk
                namespaces with Pod Security warn/audit and fix what surfaces; (3) apply
                default-deny NetworkPolicies namespace by namespace with the DNS rule in place,
                starting in staging; (4) flip to enforce and remove auto-mounted tokens; (5) wire
                scan/sign gates into CI; (6) schedule kube-bench and review the report monthly. Each
                step is independently verifiable with the commands in its section, which means each
                step can be reverted cleanly if a workload breaks.
              </p>
            </section>

            <section className='mb-10'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>Key takeaways</h2>
              <ul className='list-disc list-inside space-y-2 mb-4'>
                <li>
                  Kubernetes is permissive by default; the highest-leverage controls are cheap
                  configuration: disable anonymous access, enforce RBAC, encrypt secrets at rest.
                </li>
                <li>
                  Pod Security Standards with the built-in admission controller (enforce baseline
                  minimum, restricted for workloads) replace the retired PodSecurityPolicy machinery
                  and are stable since Kubernetes 1.25.
                </li>
                <li>
                  The restricted baseline for every app pod: non-root, allowPrivilegeEscalation
                  false, drop ALL capabilities, seccomp RuntimeDefault, read-only root filesystem
                  with emptyDir for writable paths.
                </li>
                <li>
                  NetworkPolicies are additive and require both ends to allow a connection —
                  default-deny per namespace, always with an explicit DNS egress rule, or nothing
                  resolves.
                </li>
                <li>
                  RBAC failure modes to hunt: secrets list/watch equals read, workload creation
                  equals namespace rights, wildcard privileges, and any human in cluster-admin or
                  system:masters.
                </li>
                <li>
                  Scan images with severity gates, pin digests, and verify signatures at admission;
                  benchmarks (CIS via kube-bench) are the floor, and each control needs its own
                  verification command to be real.
                </li>
                <li>
                  Roll out namespace by namespace with warn/audit before enforce, staging first —
                  every control here has a named breakage and a named mitigation.
                </li>
              </ul>
            </section>

            <section className='mb-10 border-t border-slate-800 pt-8'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>Kokkuvõte eesti keeles</h2>
              <p className='leading-relaxed mb-4'>
                Kubernetes ei ole vaikimisi turvaline — turvalisus tuleb konfiguratsioonist.
                Käesolev juhend annab tegevusjärjekorras kontrollnimekirja: (P0) API-serveri
                anonüümse juurdepääsu keelamine ja RBAC-kasutusloogika, secret-ide krüpteerimine
                puhkeolekus (etcd-s), kubeleti autentimine ja autoriseerimine, Pod Security
                Standards&#39;i jõustamine (restricted profiil rakenduste jaoks: mitte-root, ilma
                privilege-eskalatsioonita, kõik capability&#39;d eemaldatud, seccomp RuntimeDefault,
                kirjutuskaitstud juurfailisüsteem), (P1) vaikimisi keelavad NetworkPolicy&#39;d koos
                DNS-reegliga ning piltide skaneerimine, digesti kasutamine ja allkirjastamine, (P2)
                pidev kube-bench skaneerimine. Iga kontrolli juures on nii YAML-konfiguratsioon kui
                ka käsk, mis tõestab, et kontroll töötab, ning iga kontrolli &quot;hind&quot; ehk
                see, mis selle sisselülitamisel katki läheb ja kuidas seda leevendada. Soovituslik
                kasutuselevõtt: warn/audit enne enforce&#39;i, staadium enne toodangut, namespace
                haaval. Täielikud konfiguratsioonid ja käsud on ülal inglise keeles.
              </p>
            </section>

            <section className='mb-10 border-t border-slate-800 pt-8'>
              <h2 className='text-xl text-sky-500 font-semibold mb-4'>Sources</h2>
              <ul className='list-disc list-inside space-y-1 text-sm'>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://kubernetes.io/docs/tasks/administer-cluster/securing-a-cluster/'
                  >
                    Kubernetes documentation — Securing a Cluster
                  </a>
                </li>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://kubernetes.io/docs/concepts/security/pod-security-standards/'
                  >
                    Kubernetes documentation — Pod Security Standards
                  </a>
                </li>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://kubernetes.io/docs/concepts/security/pod-security-admission/'
                  >
                    Kubernetes documentation — Pod Security Admission
                  </a>
                </li>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://kubernetes.io/docs/concepts/security/rbac-good-practices/'
                  >
                    Kubernetes documentation — RBAC Good Practices
                  </a>
                </li>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://kubernetes.io/docs/concepts/services-networking/network-policies/'
                  >
                    Kubernetes documentation — Network Policies
                  </a>
                </li>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://kubernetes.io/docs/tutorials/security/seccomp/'
                  >
                    Kubernetes documentation — Restrict a Container&apos;s Syscalls with seccomp
                  </a>
                </li>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://www.nsa.gov/Press-Room/News-Highlights/Article/Article/2716980/nsa-cisa-release-kubernetes-hardening-guidance/'
                  >
                    NSA &amp; CISA — Kubernetes Hardening Guidance (2021, updated 2022; current
                    version 1.2)
                  </a>
                </li>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://www.cisecurity.org/benchmark/kubernetes'
                  >
                    CIS — Kubernetes Benchmark
                  </a>
                </li>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://github.com/aquasecurity/kube-bench'
                  >
                    aquasecurity/kube-bench — CIS Kubernetes Benchmark automation
                  </a>
                </li>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://csrc.nist.gov/pubs/sp/800/190/final'
                  >
                    NIST SP 800-190 — Application Container Security Guide
                  </a>
                </li>
                <li>
                  <a
                    className='text-sky-400 hover:text-sky-300'
                    href='https://nvd.nist.gov/vuln/detail/CVE-2025-1974'
                  >
                    NVD — CVE-2025-1974 (ingress-nginx RCE, IngressNightmare cluster)
                  </a>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
