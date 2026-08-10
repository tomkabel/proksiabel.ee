---
title: "Simsup.com: how could it sell Estonian +372 eSIMs on Elisa's network?"
source: "https://simsup.com/"
author: "Research memo"
published:
created: 2026-07-22
description: "Public-source investigation of the likely wholesale, MVNO, roaming and eSIM-provisioning model behind simsup.com's Estonian number eSIM."
tags:
  - "research"
  - "telecom"
  - "esim"
  - "elisa"
  - "mvno"
---

# Deep research: Simsup.com and Estonian +372 eSIMs

**Research date:** 2026-07-22  
**Question:** What contract, B2B service, or technical strategy could let Simsup sell a real Estonian mobile eSIM that appears to use Elisa's network?

## Executive conclusion

The strongest public-source conclusion is that Simsup is operating as a privacy-focused retail telecom brand backed by an undisclosed wholesale connectivity provider, MVNE/MVNA, or carrier-reseller arrangement. It is almost certainly not building its own radio network. Simsup says its dedicated product is a “real Estonian +372 mobile number” with voice, SMS and data; it is valid for 180 days, can be recharged, and roams abroad. Its rate sheet lists Elisa as the Estonian operator. [Simsup home page](https://simsup.com/), [Simsup FAQ](https://simsup.com/faq), [Simsup rates](https://simsup.com/rates)

There is no public evidence located during this investigation that proves a signed contract between Simsup and Elisa Eesti AS, or even that Simsup is the direct Elisa counterparty. Elisa does publicly advertise wholesale roaming access and specifically asks prospective customers to identify themselves as an MNO, MVNO or reseller. That makes a contractual route plausible, but the public material is an invitation/reference-offer mechanism, not proof that Simsup used it. [Elisa Carrier Services](https://www.elisa.ee/et/eraklient/carrier-services)

The key technical/legal distinction is between “using Elisa's network” and “owning an Estonian +372 number.” A roaming reseller normally uses a home operator's IMSI/MSISDN while attaching to a visited network. It does not receive a local number merely because the handset camps on Elisa. A native +372 mobile number therefore points to one of three arrangements: an Elisa-hosted line sold through a reseller/white-label channel; an MVNO/MVNA arrangement in which the upstream provider controls the subscription and number resources; or a direct/indirect wholesale arrangement in which the retail brand has its own regulatory and numbering responsibilities.

The most likely commercial model is **indirect wholesale resale / MVNE-backed light MVNO**, not a full MVNO and not a simple data-eSIM aggregator. Simsup's product has a native mobile number, voice and SMS, prepaid balance, number expiry and roaming. Those capabilities require more than a generic travel-data catalogue and require a carrier-side subscription/provisioning system. The precise Elisa relationship remains unverified.

## What Simsup publicly claims

Simsup's current pages establish the following facts:

* The dedicated product is sold as a **real Estonian +372 mobile number** with calls, SMS and data.
* The number is offered for a one-time €29.95, is valid for 180 days, and can be recharged.
* The number eSIM is ready immediately after payment; delivery is a private order link containing a QR code and activation details.
* No account or identity verification is requested. Email is optional.
* Bitcoin, Lightning and Monero are accepted; the privacy policy says payment is processed through BTCPay Server.
* The rate sheet says Estonia is served by **Elisa**, with data priced at €1.54/GB, SMS at €0.19 and voice at €0.00 inbound / €0.25 outbound. The rate sheet says rates are refreshed from “carrier partners.”
* Simsup's privacy policy says provisioning on its “carrier networks” requires only a plan code and that no name, email or other personal data is sent to network operators.
* The site does not name an upstream MVNO, MVNE, MVNA, SIM manufacturer, number-holder, legal entity, Elisa account, or wholesale agreement.

These are statements by Simsup about its own service, not independent confirmation of its underlying carrier relationship. [Home](https://simsup.com/), [FAQ](https://simsup.com/faq), [Rates](https://simsup.com/rates), [Terms](https://simsup.com/terms), [Privacy](https://simsup.com/privacy)

## What Elisa publicly offers

Elisa Eesti's Carrier Services page is the most important public clue. It asks an interested party to provide the contact person's name, company name, VAT code, company type—explicitly including **MNO, MVNO or reseller**—and whether it wants **Direct Wholesale Roaming Access** or **Wholesale Roaming Resale Access**. Elisa publishes reference-offer documents and says an access request is followed by an agreement. [Elisa Carrier Services](https://www.elisa.ee/et/eraklient/carrier-services)

The public reference offers describe a formal B2B relationship rather than an ordinary consumer SIM purchase. The documents contemplate technical integration, billing, interoperability testing, fraud procedures, data-protection obligations, service levels, and in the direct-access document, possible bank guarantees or upfront payment and provision of test U/SIMs. [Direct Wholesale Roaming Access Reference Offer](https://www.elisa.ee/UserFiles/esindus/elisast/kontaktid/sideettevotjale/Direct_Wholesale_Roaming_Access_Reference_Offer.pdf), [Wholesale Resale Reference Offer](https://static.elisa.com/v2/image/2tqybbhjs47b/2JYsFTvAaYYoCyI83XgUJH/Elisa%20Wholesale%20Resale%20Reference%20Offer.pdf)

However, those documents are principally about **roaming access**. They do not, by themselves, demonstrate that a reseller can issue an Estonian native mobile number, obtain an Estonian numbering block, or run a complete domestic MVNO service. A separate MVNO/mobile wholesale or number-holder arrangement would likely be needed for the +372 subscription itself.

## Estonian regulatory implications

The Consumer Protection and Technical Regulatory Authority (TTJA) states that use of Estonian telephone and mobile-number resources requires a numbering licence. It also says the applicant must be registered as a telecommunications operator and must have submitted a notice of commencement of economic activity. The licence is normally issued for one year; after a quantity-based licence is issued, the holder books individual numbers in the Numbering Management Database. [TTJA: Numbering](https://ttja.ee/en/business-client/communications-media/communication-services/numbering)

The Electronic Communications Act covers public electronic communications networks and publicly available electronic communications services, including economic-activity notification and numbering management. [Electronic Communications Act](https://www.riigiteataja.ee/en/eli/511092025009/consolide)

This leaves an important fork:

1. **Reseller under an upstream number holder:** Elisa or an upstream MVNO holds the numbering resource and remains the regulated communications provider; Simsup is a retail distributor or branded reseller. In this case Simsup can sell the service without necessarily holding the specific number block itself, subject to the exact service-provider and contract structure.
2. **Light MVNO / service provider:** Simsup or its upstream enabler controls the retail service, numbering relationship, billing and provisioning while Elisa supplies radio/core access. The responsible entity must handle the relevant TTJA notification, numbering, interconnection, emergency, portability, fraud and lawful-access obligations.
3. **Full MVNO:** Simsup would operate substantial core-network and subscriber-management functions and use Elisa primarily for radio access. Nothing public about Simsup suggests this level of infrastructure; it is the least likely option.

The public record does not identify which fork applies.

## Likely supply-chain models

### Model A — Elisa direct branded reseller

Elisa allocates or activates lines under Elisa's own numbering and core systems. Simsup supplies the storefront, crypto checkout, customer support and private order-link experience. Elisa or an Elisa-connected provisioning system creates the eSIM profile; Simsup displays the QR code.

This model fits the small retail footprint and the lack of public evidence that Simsup operates telecom infrastructure. It also best explains why the site can say “Elisa” without exposing a separate upstream brand. The weakness is that a direct relationship of this kind has not been disclosed.

### Model B — MVNE/MVNA or global carrier aggregator upstream

An MVNE/MVNA buys or controls wholesale subscriptions from one or more MNOs, operates the OSS/BSS, numbering, billing and eSIM provisioning stack, and exposes an API or reseller portal to Simsup. Simsup then sells the product under its own brand and margin.

This is the most plausible model for a seller advertising 130+ destinations while also offering one voice/SMS-capable +372 product. A generic eSIM aggregator can provision data-only travel profiles, but the dedicated number product requires subscriber identity, voice/SMS routing, recharge logic, number lifecycle and roaming controls. The upstream provider may be the contractual Elisa customer even if Simsup is not.

### Model C — Wholesale roaming resale access

Simsup or its upstream carrier obtains wholesale roaming resale access from Elisa, then allows a foreign home subscription to roam on Elisa's network. Elisa's public offer expressly contemplates access seekers that are resellers and provides access to wholesale roaming services.

This model could explain a claim that a Simsup eSIM works on Elisa radio infrastructure, especially for data-only products. It does **not** by itself explain a native Estonian +372 number. In ordinary roaming, the number belongs to the home operator; Elisa is the visited network. A +372 number would therefore require either a separate Estonian home subscription or an upstream carrier that owns/controls an Estonian number and uses Elisa as its radio partner.

### Model D — Elisa consumer/business line purchased in bulk

Simsup could theoretically buy ordinary Elisa lines under a corporate account and redistribute their eSIM activation materials. This is commercially and contractually risky, would likely violate ordinary customer terms, and would not explain a scalable global product unless Elisa expressly authorised it. It is possible in the abstract but not the leading hypothesis.

## eSIM provisioning: what must happen technically

The QR code is not itself the mobile service. Under the GSMA consumer architecture, the phone's Local Profile Assistant contacts an SM-DP+ server; the SM-DP+ prepares and securely delivers the carrier profile to the eUICC. The profile contains the operator identity and subscriber credentials. [GSMA: eSIM Consumer Architecture](https://www.gsma.com/solutions-and-impact/technologies/esim/about/), [GSMA: eSIM Compliance](https://www.gsma.com/solutions-and-impact/technologies/esim/compliance/), [GSMA architecture guide](https://www.gsma.com/solutions-and-impact/technologies/esim/wp-content/uploads/2024/07/A-guide-to-eSIM-Architectures-Final.pdf)

For Simsup's workflow, the probable sequence is:

`payment confirmed → plan selected → upstream profile reserved → activation code / matching ID returned → private order page shows QR → phone LPA downloads profile from SM-DP+ → profile authenticates on home or visited network`

Simsup does not need to own an SM-DP+ server to do this. It can use an upstream carrier's or MVNE's GSMA-compliant SM-DP+ through an API, reseller portal or white-label order system. The public site supports this inference because it says the “eSIM with Number” is ready immediately and the privacy policy describes sending a plan code to network operators. It does not prove which SM-DP+ provider is involved.

## What contract would normally be required?

The likely contractual stack is one of these:

* **Wholesale mobile / MVNO or reseller agreement** — scope of radio/core access, eligible products, number ownership, IMSI ranges, voice/SMS/data services, roaming, pricing, minimums, settlement, fraud controls and termination.
* **eSIM/RSP or provisioning agreement** — access to an SM-DP+ API or portal, profile inventory, activation-code generation, EID/ICCID handling, security, certificate responsibilities and replacement/deletion rules.
* **Interconnection and numbering arrangements** — number-resource ownership, call/SMS origination and termination, portability, emergency services and routing.
* **SLA and technical-integration schedules** — testing, interfaces, incident response, maintenance, uptime, usage files and reconciliation.
* **Data-processing and security terms** — controller/processor roles, retention, lawful requests, breach handling and audit rights.
* **Payment/credit terms** — prepaid wholesale balance, deposits or bank guarantee, usage invoicing and chargeback/fraud treatment.

Elisa's public reference offers support several of these categories for wholesale roaming, but they do not reveal Simsup's private commercial terms.

## Evidence assessment

| Proposition | Assessment | Why |
| --- | --- | --- |
| Simsup sells a +372 voice/SMS/data eSIM | Confirmed by Simsup's own pages | Home page and FAQ state this explicitly. |
| Simsup's Estonia rate sheet names Elisa | Confirmed by Simsup's own rates page | The page lists “Elisa” under Estonia. |
| Elisa offers B2B wholesale access to resellers | Confirmed by Elisa | Elisa explicitly asks for company type MNO/MVNO/reseller. |
| Simsup has a contract with Elisa Eesti AS | **Not established** | No agreement, company name, invoice, announcement or Elisa partner listing was found. |
| Simsup is a full MVNO | Unlikely | No public evidence of its own core network, MNC, HLR/HSS/UDM, interconnect or numbering block. |
| Simsup is a light MVNO, branded reseller or MVNE customer | Most plausible | Fits the product scope and the absence of infrastructure disclosure. |
| Elisa is the home network rather than merely a visited network | Plausible but unproven | +372 suggests a domestic number; a roaming profile could still use Elisa as a visited network. |

## What would prove the actual Elisa relationship?

The following evidence would be decisive, in descending order of strength:

1. A redacted wholesale, reseller, MVNO or roaming-access agreement naming Simsup's legal entity and Elisa Eesti AS.
2. A public Elisa partner announcement, carrier-services listing, or TTJA filing connecting Simsup's legal entity to Elisa.
3. A TTJA numbering licence or Numbering Management Database record showing who holds the specific +372 number range used by the product.
4. A profile-level technical inspection showing the IMSI's MCC/MNC, home PLMN and SM-DP+ provider, combined with the number-holder record. A phone's displayed network name alone is not sufficient.
5. A carrier-generated activation/provisioning document, invoice or API documentation linking the service to Elisa.

The most useful non-invasive verification is to obtain one legitimately purchased test eSIM, record only its public subscription metadata (ICCID/IMSI/MCC/MNC and displayed home/visited network), and compare the number range against TTJA's public numbering database. Do not publish the full QR code, activation code, IMSI, ICCID or subscriber number: those are credentials or identifying telecom data.

## Contrarian possibilities and limitations

* The word “Elisa” on a public rate sheet could be a manually maintained carrier label, not proof of current direct wholesale sourcing.
* The +372 product could be a number from an upstream international carrier that roams on Elisa, rather than a number issued by Elisa Eesti.
* A “real mobile number” may still be subject to carrier anti-abuse, SMS filtering, service-specific blocking and roaming restrictions. It is not evidence that all OTP or banking use will work.
* Simsup's privacy policy describes its data practices but cannot establish the upstream carrier's own logging, retention or lawful-access obligations.
* Public search results and privacy-directory pages are secondary or user-generated evidence. They can support discovery but do not prove corporate identity or carrier contracts.

## Bottom line

The defensible answer is not “Simsup has publicly proven an Elisa contract.” The defensible answer is:

> Simsup most likely buys a pre-provisioned voice/SMS/data subscription or eSIM profile from an upstream MVNE/MVNA, carrier reseller, or authorised wholesale partner. That upstream party may have a direct Elisa wholesale/mobile agreement. Simsup then operates the privacy-preserving storefront, crypto payment flow, private order link and retail support. A direct Simsup–Elisa agreement is possible because Elisa expressly serves MNOs, MVNOs and resellers, but it is not established by public evidence.

## Source index

### Primary sources

1. [Simsup home page](https://simsup.com/) — product claims, +372 number, price, delivery, no-ID positioning.
2. [Simsup FAQ](https://simsup.com/faq) — number functionality, roaming, validity and support claims.
3. [Simsup rates](https://simsup.com/rates) — Estonia/Elisa label, rates and carrier-partner statement.
4. [Simsup terms](https://simsup.com/terms) — service definition, refunds and carrier-network disclaimer.
5. [Simsup privacy policy](https://simsup.com/privacy) — plan-code provisioning and operator-data claims.
6. [Simsup “We rebuilt simsup”](https://simsup.com/blog/introducing-simsup) — site architecture, no-account and privacy claims.
7. [Elisa Carrier Services](https://www.elisa.ee/et/eraklient/carrier-services) — wholesale access routes and access-seeker information requirements.
8. [Elisa Direct Wholesale Roaming Access Reference Offer](https://www.elisa.ee/UserFiles/esindus/elisast/kontaktid/sideettevotjale/Direct_Wholesale_Roaming_Access_Reference_Offer.pdf) — technical, fraud, testing and financial requirements.
9. [Elisa Wholesale Resale Reference Offer](https://static.elisa.com/v2/image/2tqybbhjs47b/2JYsFTvAaYYoCyI83XgUJH/Elisa%20Wholesale%20Resale%20Reference%20Offer.pdf) — resale agreement and wholesale roaming scope.
10. [TTJA: Numbering](https://ttja.ee/en/business-client/communications-media/communication-services/numbering) — numbering licences, operator registration and number booking.
11. [Estonian Electronic Communications Act](https://www.riigiteataja.ee/en/eli/511092025009/consolide) — communications-service notification and numbering framework.
12. [GSMA: Consumer eSIM](https://www.gsma.com/solutions-and-impact/technologies/esim/about/) — consumer eSIM architecture.
13. [GSMA: eSIM Compliance](https://www.gsma.com/solutions-and-impact/technologies/esim/compliance/) — SM-DP+/SM-DS compliance and certification.
14. [GSMA: A guide to eSIM architectures](https://www.gsma.com/solutions-and-impact/technologies/esim/wp-content/uploads/2024/07/A-guide-to-eSIM-Architectures-Final.pdf) — SM-DP+, LPA and profile-download flow.
15. [BEREC wholesale-roaming guidelines](https://www.berec.europa.eu/en/document-categories/berec/regulatory-best-practices/guidelines/berec-guidelines-on-regulation-eu-no-5312012-as-amended-by-regulation-eu-20152120-and-by-regulation-eu-2017920-wholesale-roaming-guidelines) — direct/resale roaming distinction and access seekers.

### Secondary/context sources

16. [Journey eSIM wholesale API documentation](https://journeyesims.com/enterprise/docs) — example of API delivery of activation material.
17. [Zesimo wholesale eSIM platform](https://zesimo.com/) — example of white-label reseller infrastructure.
18. [Roamic reseller platform](https://reseller.roamic.com/) — example of API-based eSIM inventory and top-up model.
19. [Orange Romania resale roaming access](https://www.orange.ro/wholesale/en/resale-roaming-access/) — comparable MNO resale model.
20. [Cunicula Simsup profile](https://cunicula.com/en/provider/simsup) — third-party description; useful only as secondary context.

## Methodology note

Research used direct Firecrawl scrapes of Simsup and Elisa pages, public-source web discovery, official regulator/legal pages, GSMA documentation, and Google AI discovery queries. Firecrawl's autonomous-agent and search endpoints returned errors during this run; Google AI output was treated as discovery only, not as independent proof. The report therefore relies on the full text of the primary pages and explicitly marks inference. Retrieval date: 2026-07-22.
