
const CHAPTERS = [
  {
    id: "1200-12-01",
    title: "General Rules",
    updated: "June 23, 2026",
    officialPdf: "https://publications.tnsosfiles.com/rules/1200/1200-12/1200-12-01.20260623.pdf",
  },
  {
    id: "1200-12-02",
    title: "Disasters, Emergencies and Mass Casualty Events",
    updated: "July 9, 2014",
    officialPdf: "https://publications.tnsosfiles.com/rules/1200/1200-12/1200-12-02.20140709.pdf",
  },
  {
    id: "1200-12-03",
    title: "Response Agencies for Cardiac Emergencies",
    updated: "November 23, 2005",
    officialPdf: "https://publications.tnsosfiles.com/rules/1200/1200-12/1200-12-03.pdf",
  },
  {
    id: "1200-12-04",
    title: "EMT or Paramedic in Hospital Emergency Services",
    updated: "—",
    officialPdf: "https://publications.tnsosfiles.com/rules/1200/1200-12/1200-12-04.pdf",
  },
  {
    id: "1200-12-05",
    title: "Critical Care Paramedic",
    updated: "—",
    officialPdf: "https://publications.tnsosfiles.com/rules/1200/1200-12/1200-12-05.pdf",
  },
  {
    id: "1200-12-06",
    title: "EMS Board Officers and Procedures",
    updated: "—",
    officialPdf: "https://publications.tnsosfiles.com/rules/1200/1200-12/1200-12-06.pdf",
  },
  {
    id: "1200-12-07",
    title: "Community Paramedicine",
    updated: "March 15, 2020",
    officialPdf: "https://publications.tnsosfiles.com/rules/1200/1200-12/1200-12-07.20200315.pdf",
  },
];

const COMPILATION_INDEX = "https://publications.tnsosfiles.com/rules/1200/1200-12/1200-12.htm";
const STATUTE = "T.C.A. Title 68, Chapter 140";


const RULES = [
  {
    id: "01-01",
    citation: "1200-12-01-.01",
    title: "Sanitation of Ambulance",
    chapter: "1200-12-01",
    chapterTitle: "General Rules",
    summary: "Patient-compartment cleanliness, linen, decontamination after each call, and infection-control basics for permitted units.",
    digest: [
      "The patient compartment must be kept in a sanitary condition.",
      "Soiled linen is changed after each patient.",
      "The unit is cleaned and disinfected after transporting a patient with a known or suspected communicable condition.",
    ],
    watchFor: [
      "A consultant inventing a specific brand of disinfectant or a daily photo log that the rule does not require.",
      "Treating a dirty cab as a permit failure when the rule speaks to the patient compartment and linen.",
    ],
    sourceUrl: "https://publications.tnsosfiles.com/rules/1200/1200-12/1200-12-01.20260623.pdf",
  },
  {
    id: "01-02",
    citation: "1200-12-01-.02",
    title: "Ambulance Safety, Design, and Construction Standards",
    chapter: "1200-12-01",
    chapterTitle: "General Rules",
    summary:
      "What a ground ambulance must look like, how it must be maintained, and the only written paths for a temporary or replacement unit.",
    digest: [
      "Permitted ambulances must meet board-adopted design, marking, lighting, radio, and mechanical safety standards in effect at manufacture.",
      "Mechanical safety inspections are required on the published interval and failures come out of service immediately.",
      "A licensed service may operate a temporary ambulance with written acknowledgment when it replaces a permitted unit that is out for repair or maintenance.",
      "A newly acquired replacement may run up to 15 days pending inspection after title conversion, fee submission, and notice to the Division (license number, VID, original permit number).",
      "Adding a vehicle to the fleet outside that temporary path requires fee, inspection, and a permit. A letter of approval is not a substitute for a permit beyond 90 days.",
      "Insurance must be in force on any unit that rolls. Immediate written notice to the Division is part of the temporary-use path.",
    ],
    watchFor: [
      "Being told a parked reserve can never exist. The rule allows a permitted spare; it does not allow an unpermitted spare to take 911 calls.",
      "Being told a loaner during shop time is automatically illegal. The temporary-replacement paragraph exists — it requires notice, standards, and insurance.",
      "Using the 15-day replacement window as a standing spare program. That window is for an acquired replacement pending inspection, not a forever-unpermitted truck.",
    ],
    sourceUrl: "https://publications.tnsosfiles.com/rules/1200/1200-12/1200-12-01.20260623.pdf",
  },
  {
    id: "01-03",
    citation: "1200-12-01-.03",
    title: "Equipment, Medications and Supplies",
    chapter: "1200-12-01",
    chapterTitle: "General Rules",
    summary: "Each permitted vehicle carries the published equipment list for its licensed level. The list lives on the Division website and is incorporated by reference.",
    digest: [
      "Required equipment, medications, and supplies follow the specifications posted by the Division and adopted by the Board.",
      "The list applies to each permitted vehicle at the service's licensed level.",
      "The official specs page is the controlling document when the printed rule says 'as posted.'",
    ],
    watchFor: [
      "A regional consultant adding items that are not on the current published specifications.",
      "Demanding the ALS list on a unit licensed and staffed as BLS.",
    ],
    sourceUrl: "https://publications.tnsosfiles.com/rules/1200/1200-12/1200-12-01.20260623.pdf",
  },
  {
    id: "01-04",
    citation: "1200-12-01-.04",
    title: "Personnel Certification and Licensure",
    chapter: "1200-12-01",
    chapterTitle: "General Rules",
    summary: "EMR, EMT, AEMT, and paramedic scope, initial licensure, renewal hours, reciprocity, retirement, and downgrade.",
    digest: [
      "Scope follows the National EMS Scope of Practice Model plus any Board-approved extensions under medical direction.",
      "Renewal: EMR 10 CE (2 pediatric) or refresher/exam; EMT 20 CE (5 pediatric); AEMT 25 CE (8 pediatric); paramedic 32 CE (8 pediatric).",
      "Late renewal is available for 60 days with penalty; after that it is reinstatement.",
      "The Board — not a consultant — approves extended skills, courses, and examinations.",
      "Service medical directors authorize extended skills at the service and monitor quality.",
    ],
    watchFor: [
      "A consultant requiring National Registry as a standing condition when the person already holds a current Tennessee license.",
      "Extra CE hours beyond the numbers in this rule, unless the Board or medical director has a written, service-level protocol reason.",
    ],
    sourceUrl: "https://publications.tnsosfiles.com/rules/1200/1200-12/1200-12-01.20260623.pdf",
  },
  {
    id: "01-05",
    citation: "1200-12-01-.05",
    title: "Air Ambulance Standards",
    chapter: "1200-12-01",
    chapterTitle: "General Rules",
    summary: "Rotor and fixed-wing service, aircraft, and crew standards separate from ground ambulance rules.",
    digest: [
      "Air services are licensed separately from ground services.",
      "Aircraft, medical interior, and crew configuration must match the air-ambulance chapter, not the ground box-truck list.",
    ],
    watchFor: ["Applying ground-ambulance marking or permit folklore to an aircraft."],
    sourceUrl: "https://publications.tnsosfiles.com/rules/1200/1200-12/1200-12-01.20260623.pdf",
  },
  {
    id: "01-06",
    citation: "1200-12-01-.06",
    title: "Schedule of Fees",
    chapter: "1200-12-01",
    chapterTitle: "General Rules",
    summary: "Published license, vehicle-permit, repeat-inspection, and reinstatement fees. Amounts change when the Board amends this section.",
    digest: [
      "Each ground vehicle that is permitted pays an annual vehicle permit fee (commonly $250 for standard services; $100 volunteer non-profit — confirm current table).",
      "Failed inspections can trigger a published repeat-inspection fee.",
      "Replacement licenses or permits when the original is lost or changed have a published replacement fee.",
    ],
    watchFor: ["A verbal 'convenience fee' or regional surcharge that is not in this schedule."],
    sourceUrl: "https://publications.tnsosfiles.com/rules/1200/1200-12/1200-12-01.20260623.pdf",
  },
  {
    id: "01-07",
    citation: "1200-12-01-.07",
    title: "Insurance Coverage",
    chapter: "1200-12-01",
    chapterTitle: "General Rules",
    summary: "Minimum liability coverage for the licensed service and its permitted vehicles. Proof must be current.",
    digest: [
      "A service must carry the insurance required by this rule and keep verification available.",
      "Failure to maintain accurate insurance verification is listed in .11 as a ground to deny issuance or renewal of licenses or permits.",
    ],
    watchFor: ["Demanding a specific carrier or a limit above the rule without a Board citation."],
    sourceUrl: "https://publications.tnsosfiles.com/rules/1200/1200-12/1200-12-01.20260623.pdf",
  },
  {
    id: "01-08",
    citation: "1200-12-01-.08",
    title: "EMS Telecommunications",
    chapter: "1200-12-01",
    chapterTitle: "General Rules",
    summary: "Radio capability on permitted units and related FCC records.",
    digest: [
      "Permitted ambulances carry two-way communications meeting the adopted specifications.",
      "Temporary units may receive written authorization for a non-standard radio for a defined period.",
    ],
    watchFor: ["Rejecting a temporary replacement solely for radio brand when written authorization is available under .02."],
    sourceUrl: "https://publications.tnsosfiles.com/rules/1200/1200-12/1200-12-01.20260623.pdf",
  },
  {
    id: "01-09",
    citation: "1200-12-01-.09",
    title: "Ground Invalid Vehicle Standards",
    chapter: "1200-12-01",
    chapterTitle: "General Rules",
    summary: "Invalid (non-emergency, non-monitored) transport vehicles are a different class than ambulances.",
    digest: [
      "Invalid services are licensed and permitted under their own category.",
      "An invalid vehicle is not a substitute 911 ambulance.",
    ],
    watchFor: ["Parking an invalid van as a 'reserve ambulance' for emergency work."],
    sourceUrl: "https://publications.tnsosfiles.com/rules/1200/1200-12/1200-12-01.20260623.pdf",
  },
  {
    id: "01-10",
    citation: "1200-12-01-.10",
    title: "Ambulance Driver Qualifications",
    chapter: "1200-12-01",
    chapterTitle: "General Rules",
    summary: "Who may operate an ambulance, including the operator used in paramedic-only or EMT-only transport configurations under .14.",
    digest: [
      "Drivers must meet this rule's qualifications.",
      "When .14 allows a single clinician plus an operator, that operator still has to satisfy .10, hold current CPR, complete a defensive driving course, and demonstrate competency.",
    ],
    watchFor: ["Treating any county employee with a Class D as an ambulance operator without the .10 items."],
    sourceUrl: "https://publications.tnsosfiles.com/rules/1200/1200-12/1200-12-01.20260623.pdf",
  },
  {
    id: "01-11",
    citation: "1200-12-01-.11",
    title: "Ambulance Service Operations and Procedures",
    chapter: "1200-12-01",
    chapterTitle: "General Rules",
    summary: "Restraints, grounds to deny a license or permit, annual reports, dispatch timing, and the smoking buffer.",
    digest: [
      "Everyone rides belted while the vehicle is moving, except as needed to treat in the box. Patients are secured to the stretcher.",
      "The Division may deny issuance or renewal for incomplete applications, safety deficiencies on more than 25% of vehicles, missing personnel-on-call records, bad insurance verification, or ownership change.",
      "Services above minimum standards process emergency calls through a designated dispatcher and assign an available unit within two minutes, or refer by mutual aid.",
      "Class A ALS services send first response when an ambulance's arrival is expected to exceed eight minutes and those units exist.",
      "No tobacco within ten feet of an ambulance.",
    ],
    watchFor: [
      "Using a single dirty unit as if it were a 25% fleet-failure denial.",
      "Inventing a statewide response-time standard that is not the two-minute dispatch / eight-minute first-response language.",
    ],
    sourceUrl: "https://publications.tnsosfiles.com/rules/1200/1200-12/1200-12-01.20260623.pdf",
  },
  {
    id: "01-12",
    citation: "1200-12-01-.12",
    title: "Authorization of EMS Educators",
    chapter: "1200-12-01",
    chapterTitle: "General Rules",
    summary: "Who may instruct EMS courses in Tennessee.",
    digest: ["Educators must hold the Board authorization required for the course level."],
    watchFor: ["A consultant blocking an in-service class that already has an authorized instructor and course approval."],
    sourceUrl: "https://publications.tnsosfiles.com/rules/1200/1200-12/1200-12-01.20260623.pdf",
  },
  {
    id: "01-13",
    citation: "1200-12-01-.13",
    title: "EMT, AEMT and Paramedic Education Programs",
    chapter: "1200-12-01",
    chapterTitle: "General Rules",
    summary: "Program approval, student folders, and testing for initial education.",
    digest: [
      "Programs operate under Board-approved standards.",
      "Course approval uses the Division forms (PH-2792 and the level-specific folder checklists).",
    ],
    watchFor: ["Regional 'extra' student-folder items that are not on the published PH checklist for that level."],
    sourceUrl: "https://publications.tnsosfiles.com/rules/1200/1200-12/1200-12-01.20260623.pdf",
  },
  {
    id: "01-14",
    citation: "1200-12-01-.14",
    title: "Service Standards and Categories",
    chapter: "1200-12-01",
    chapterTitle: "General Rules",
    summary: "Service license, county base, Category A/B levels, staffing percentages, and the paramedic-plus-operator option.",
    digest: [
      "No ambulance or cot-equipped transport business operates in Tennessee without a service license.",
      "A license is issued only to the named applicant and only for the listed base and substations. It is not transferable and expires June 30.",
      "Each base of operations needs a State-issued service license for the county where it sits.",
      "Category A is the local-government primary 911 provider. Levels 1–4 set the percent of emergency runs that must be ALS or BLS and how they are staffed.",
      "Category B is licensed transport. Level 1 and 2 may run a paramedic as sole medical staff plus a .10-qualified operator after the medical director notifies the Office of EMS.",
      "Level 3 and 4 have a parallel single-clinician-plus-operator option for BLS work, also with medical-director notice.",
      "The service may not post into another county's protected service area against local ordinance without that government's authorization.",
      "Patients are not transported until the license is issued.",
      "Using a second party to dodge a denied license or an inspection is expressly forbidden.",
    ],
    watchFor: [
      "A consultant treating Category B staffing options as if they were illegal because 'we have always required two medics.'",
      "Requiring a second county license for a posted spare that is not a base of operations.",
      "Verbal staffing rules that ignore the Level 1–4 percentages actually written in this section.",
    ],
    sourceUrl: "https://publications.tnsosfiles.com/rules/1200/1200-12/1200-12-01.20260623.pdf",
  },
  {
    id: "01-15",
    citation: "1200-12-01-.15",
    title: "Ambulance Service Records",
    chapter: "1200-12-01",
    chapterTitle: "General Rules",
    summary: "Personnel files, dispatch and run records, hospital copies, five-day serious-injury incidents, vehicle files, and the three-day equipment inventory.",
    digest: [
      "Personnel files include license, CPR, physical, and the listed driver and telecom training items. Schedules must show who staffed each truck.",
      "A dispatch log is kept for every response: times, unit, crew names and levels, emergency vs transfer. Logs are kept at least ten years.",
      "Run reports go to the Division in the Board-approved electronic format within 60 days. The Division sends a deficiency notice within 15 days if the file is late or incomplete.",
      "A hospital copy goes with the patient. If you cannot leave paper or electronic copy on arrival, give a verbal report signed for before you leave, then file the written copy within 24 hours.",
      "Within five business days of discovery, file a written report with the Division on any incident that causes serious injury a patient could not reasonably be expected from their condition. That includes medication errors, protocol failures, and major device, communications, or equipment failure or user error that causes serious injury or a delay in response or treatment.",
      "Vehicle files: title or registration, mechanical work, and ownership papers for medical equipment.",
      "Equipment inventory is recorded at least every three days on each vehicle and kept available for three months.",
      "FCC radio records stay on file. All of the above is open to a Division inspector.",
    ],
    watchFor: [
      "Demanding a daily inventory when the rule says every three days.",
      "Inventing a 7-year retention when the run-log rule says 10.",
    ],
    sourceUrl: "https://publications.tnsosfiles.com/rules/1200/1200-12/1200-12-01.20260623.pdf",
  },
  {
    id: "01-16",
    citation: "1200-12-01-.16",
    title: "Emergency Medical First Responders",
    chapter: "1200-12-01",
    chapterTitle: "General Rules",
    summary: "First-response agencies operating under the primary provider.",
    digest: [
      "First-response agencies coordinate with the Category A primary provider in the jurisdiction.",
      "They are not a substitute ambulance service license.",
    ],
    watchFor: ["Using a first-response truck with a cot as an unlicensed transport service."],
    sourceUrl: "https://publications.tnsosfiles.com/rules/1200/1200-12/1200-12-01.20260623.pdf",
  },
  {
    id: "01-17",
    citation: "1200-12-01-.17",
    title: "Unethical Practices and Conduct",
    chapter: "1200-12-01",
    chapterTitle: "General Rules",
    summary: "Conduct that can draw Board discipline, including false information and concealing equipment deficiencies.",
    digest: [
      "Discipline can follow dishonesty in care, failure to report incompetent practice, confidentiality breaches, working on a dead license, delegation to the unqualified, false reports, and concealing equipment deficiencies.",
      "Willfully failing to file required reports is listed here.",
    ],
    watchFor: ["This section is not a consultant's extra policy manual. It is a discipline list."],
    sourceUrl: "https://publications.tnsosfiles.com/rules/1200/1200-12/1200-12-01.20260623.pdf",
  },
  {
    id: "01-18",
    citation: "1200-12-01-.18",
    title: "Emergency Medical Dispatcher Standards",
    chapter: "1200-12-01",
    chapterTitle: "General Rules",
    summary: "When a service uses emergency medical dispatch, this section sets the standard.",
    digest: ["EMD programs follow this section when the service holds that function out."],
    watchFor: ["Requiring EMD certification of every county 911 call-taker when the service does not operate an EMD program."],
    sourceUrl: "https://publications.tnsosfiles.com/rules/1200/1200-12/1200-12-01.20260623.pdf",
  },
  {
    id: "01-19",
    citation: "1200-12-01-.19",
    title: "Automated External Defibrillator Programs",
    chapter: "1200-12-01",
    chapterTitle: "General Rules",
    summary: "Public and agency AED programs under Board rules.",
    digest: ["AED programs follow the published training and reporting items in this section."],
    watchFor: [],
    sourceUrl: "https://publications.tnsosfiles.com/rules/1200/1200-12/1200-12-01.20260623.pdf",
  },
  {
    id: "01-20",
    citation: "1200-12-01-.20",
    title: "Training for EMS for Children",
    chapter: "1200-12-01",
    chapterTitle: "General Rules",
    summary: "Pediatric training expectations tied to personnel renewal and service practice.",
    digest: ["Pediatric hours in .04 renewal are the numeric floor. This section addresses EMSC training content."],
    watchFor: [],
    sourceUrl: "https://publications.tnsosfiles.com/rules/1200/1200-12/1200-12-01.20260623.pdf",
  },
  {
    id: "01-21",
    citation: "1200-12-01-.21",
    title: "Destination Determination",
    chapter: "1200-12-01",
    chapterTitle: "General Rules",
    summary: "Trauma, pediatric trauma, pediatric medical emergencies, and when medical control may divert.",
    digest: [
      "Trauma patients go to the most appropriate trauma center under regional triage or direct medical direction — closer undesignated hospitals may be bypassed.",
      "Pediatric Step One / Two trauma goes toward a Level I or Comprehensive Regional Pediatric Center, with a 30-minute ground exception via Trauma Medical Control.",
      "Contaminated patients are not transported before decontamination.",
      "Patients who do not meet trauma or CRPC criteria go to the most appropriate facility under local or regional guidelines.",
      "Refusal or redirection that is not a refusal of care does not by itself violate this rule.",
    ],
    watchFor: [
      "A consultant treating every rural transport to the local ED as a destination violation when the patient does not meet trauma steps.",
      "Ignoring medical-control authority that the rule itself grants.",
    ],
    sourceUrl: "https://publications.tnsosfiles.com/rules/1200/1200-12/1200-12-01.20260623.pdf",
  },
  {
    id: "02-01",
    citation: "1200-12-02-.01",
    title: "Introduction",
    chapter: "1200-12-02",
    chapterTitle: "Disasters, Emergencies and Mass Casualty Events",
    summary: "Authorizes autoinjector or intramuscular antidotes approved by the Board or State Medical Officer during terrorist or similar chemical-agent events.",
    digest: [
      "During a terrorist event or similar emergency, responders may encounter patients or persons exposed to toxic chemical agents.",
      "This rule authorizes emergency treatment by autoinjection or intramuscular injection of antidotes or medications approved by the Board or the State Medical Officer.",
    ],
    watchFor: ["Treating this chapter as a standing spare-ambulance or staffing waiver for ordinary operations."],
    sourceUrl: "https://publications.tnsosfiles.com/rules/1200/1200-12/1200-12-02.20140709.pdf",
  },
  {
    id: "02-02",
    citation: "1200-12-02-.02",
    title: "Definitions",
    chapter: "1200-12-02",
    chapterTitle: "Disasters, Emergencies and Mass Casualty Events",
    summary: "Defines emergency responder and related terms used for disaster and mass-casualty operations in this chapter.",
    digest: [
      "Emergency responder includes EMTs and other personnel named in this section for disaster and chemical-agent response.",
      "Read definitions here before applying chapter 02 procedures to a local drill or ordinary mutual-aid run.",
    ],
    watchFor: [],
    sourceUrl: "https://publications.tnsosfiles.com/rules/1200/1200-12/1200-12-02.20140709.pdf",
  },
  {
    id: "02-03",
    citation: "1200-12-02-.03",
    title: "Procedures",
    chapter: "1200-12-02",
    chapterTitle: "Disasters, Emergencies and Mass Casualty Events",
    summary: "When kits are available, EMS personnel may give Board- or Commissioner-approved IM or autoinjector antidotes.",
    digest: [
      "Personnel may administer approved antidotes when the kits or approved means are available.",
      "Approval of the drug or device sits with the Board or the Commissioner of Health.",
    ],
    watchFor: [],
    sourceUrl: "https://publications.tnsosfiles.com/rules/1200/1200-12/1200-12-02.20140709.pdf",
  },
  {
    id: "02-04",
    citation: "1200-12-02-.04",
    title: "Reports",
    chapter: "1200-12-02",
    chapterTitle: "Disasters, Emergencies and Mass Casualty Events",
    summary: "Reporting required after use of the disaster/chemical-agent procedures in this chapter.",
    digest: [
      "Uses of chapter 02 countermeasures are reportable as this section requires.",
      "This is separate from the ordinary 60-day ePCR clock in 1200-12-01-.15.",
    ],
    watchFor: [],
    sourceUrl: "https://publications.tnsosfiles.com/rules/1200/1200-12/1200-12-02.20140709.pdf",
  },
  {
    id: "02-05",
    citation: "1200-12-02-.05",
    title: "Notification",
    chapter: "1200-12-02",
    chapterTitle: "Disasters, Emergencies and Mass Casualty Events",
    summary: "Who must be notified when chapter 02 disaster or chemical-agent procedures are used.",
    digest: [
      "Notification under this section is in addition to ordinary dispatch and hospital report duties.",
    ],
    watchFor: [],
    sourceUrl: "https://publications.tnsosfiles.com/rules/1200/1200-12/1200-12-02.20140709.pdf",
  },
  {
    id: "02-06",
    citation: "1200-12-02-.06",
    title: "Immunizations During Declared Disasters and Emergencies",
    chapter: "1200-12-02",
    chapterTitle: "Disasters, Emergencies and Mass Casualty Events",
    summary: "During a T.C.A. § 58-2-101 declaration, AEMT/paramedic/CCP personnel may vaccinate in health-department clinics after just-in-time training.",
    digest: [
      "Applies only in areas covered by an order declaring a disaster or emergency under T.C.A. § 58-2-101 et seq.",
      "EMT-IV, AEMT, paramedic, and CCP may immunize in State or local health-department vaccination clinics.",
      "The health department must give just-in-time training, document completion, and provide medical direction at the clinic.",
    ],
    watchFor: ["Using an expired COVID-era order as cover for clinic work that is not under a current declaration."],
    sourceUrl: "https://publications.tnsosfiles.com/rules/1200/1200-12/1200-12-02.20140709.pdf",
  },
  {
    id: "03-01",
    citation: "1200-12-03-.01",
    title: "General Rules — Cardiac Emergency Response Agencies",
    chapter: "1200-12-03",
    chapterTitle: "Response Agencies for Cardiac Emergencies",
    summary: "How a county or ECD coordinates public-safety AED response without becoming an ambulance service.",
    digest: [
      "Local government or the ECD coordinates public-safety agencies to get AEDs to sudden-cardiac-arrest victims through local dispatch.",
      "A responding agency must be a legally recognized public-safety or health organization, carry a maintained AED, have two-way radio, staff a CPR/AED-trained person or licensed clinician, and have physician medical control.",
      "Each participant keeps an MOU with the primary ambulance provider covering dispatch limits, radio, on-scene roles, medical direction, equipment, and QA.",
      "Dispatch is restricted to events reasonably believed to be sudden cardiac arrest.",
      "Liability coverage meets T.C.A. § 29-20-403.",
      "Nothing in this chapter may violate first-responder rule 1200-12-01-.16.",
    ],
    watchFor: [
      "An AED chase car that starts transporting patients. That is ambulance work under .14, not this chapter.",
    ],
    sourceUrl: "https://publications.tnsosfiles.com/rules/1200/1200-12/1200-12-03.pdf",
  },
  {
    id: "04-01",
    citation: "1200-12-04-.01",
    title: "Responsibilities of the EMT or EMT-Paramedic",
    chapter: "1200-12-04",
    chapterTitle: "EMT or Paramedic in Hospital Emergency Services",
    summary: "What an EMT or paramedic may do when working inside a hospital emergency department.",
    digest: [
      "Patient care in hospital emergency services is performed under nursing supervision.",
      "Extended skills stay inside 1200-12-01-.04 scope and require authorized medical control plus nursing supervision.",
      "The clinician must stay trained and competent for the duties assigned.",
    ],
    watchFor: ["Treating ED employment as a substitute for an ambulance-service license or vehicle permit."],
    sourceUrl: "https://publications.tnsosfiles.com/rules/1200/1200-12/1200-12-04.pdf",
  },
  {
    id: "04-02",
    citation: "1200-12-04-.02",
    title: "Each Hospital to Maintain Evidence of Training",
    chapter: "1200-12-04",
    chapterTitle: "EMT or Paramedic in Hospital Emergency Services",
    summary: "Hospitals that employ EMTs or paramedics in the ED must keep proof of continued competence.",
    digest: [
      "The hospital — not the regional consultant — keeps the training and competence file for ED-employed EMS personnel.",
    ],
    watchFor: [],
    sourceUrl: "https://publications.tnsosfiles.com/rules/1200/1200-12/1200-12-04.pdf",
  },
  {
    id: "05-01",
    citation: "1200-12-05-.01",
    title: "Preamble",
    chapter: "1200-12-05",
    chapterTitle: "Critical Care Paramedic",
    summary: "Sets the purpose of the critical-care paramedic endorsement on top of paramedic licensure.",
    digest: [
      "Critical care is a Board endorsement with its own chapter. It is not a local nickname for an experienced medic.",
    ],
    watchFor: [],
    sourceUrl: "https://publications.tnsosfiles.com/rules/1200/1200-12/1200-12-05.pdf",
  },
  {
    id: "05-02",
    citation: "1200-12-05-.02",
    title: "Scope of Practice for Critical Care Paramedic",
    chapter: "1200-12-05",
    chapterTitle: "Critical Care Paramedic",
    summary: "Additional critical-care skills an endorsed paramedic may perform under medical control.",
    digest: [
      "A CCP is an experienced paramedic with additional training for critically ill patients of all ages.",
      "Board-approved devices during transport and special situations.",
      "Access and manage existing invasive lines (PICC, Hickman, Port-a-Cath, central, arterial).",
      "Initiate and manage ventilators; manage tracheostomy tubes.",
      "Initiate and manage surgical airways and chest tubes.",
      "Cardiac interventions and advanced therapeutic devices; perform and interpret 12-lead ECGs.",
    ],
    watchFor: ["Requiring a CCP on every interfacility transfer that does not meet Specialty Care Transport in .14."],
    sourceUrl: "https://publications.tnsosfiles.com/rules/1200/1200-12/1200-12-05.pdf",
  },
  {
    id: "05-03",
    citation: "1200-12-05-.03",
    title: "Critical Care Paramedic Requirements",
    chapter: "1200-12-05",
    chapterTitle: "Critical Care Paramedic",
    summary: "Who may hold the endorsement: licensed paramedic in good standing plus the chapter 05 training and exam path.",
    digest: [
      "Applicant must meet paramedic requirements in 1200-12-01-.04 and hold a current paramedic license in good standing.",
      "Students in an approved CCP program may use .02 procedures under medical control during training.",
    ],
    watchFor: [],
    sourceUrl: "https://publications.tnsosfiles.com/rules/1200/1200-12/1200-12-05.pdf",
  },
  {
    id: "05-04",
    citation: "1200-12-05-.04",
    title: "Critical Care Paramedic Training Programs",
    chapter: "1200-12-05",
    chapterTitle: "Critical Care Paramedic",
    summary: "Board approval of CCP training programs.",
    digest: [
      "Only Board-approved CCP programs satisfy the endorsement.",
      "Program approval is a Board action, not a consultant courtesy.",
    ],
    watchFor: [],
    sourceUrl: "https://publications.tnsosfiles.com/rules/1200/1200-12/1200-12-05.pdf",
  },
  {
    id: "06-01",
    citation: "1200-12-06-.01",
    title: "Responsibilities of the Board Chairperson",
    chapter: "1200-12-06",
    chapterTitle: "EMS Board Officers and Procedures",
    summary: "Duties of the EMS Board chair.",
    digest: [
      "The chair runs Board business. That is not the same role as the State EMS Director or a regional consultant.",
      "Board meeting dates, agendas, and minutes are posted on the state EMS site, not printed in this section.",
    ],
    watchFor: ["Treating a director or consultant letter as if the chair had entered a Board order."],
    sourceUrl: "https://publications.tnsosfiles.com/rules/1200/1200-12/1200-12-06.pdf",
  },
  {
    id: "06-02",
    citation: "1200-12-06-.02",
    title: "Procedures for Contested Cases Before the EMS Board",
    chapter: "1200-12-06",
    chapterTitle: "EMS Board Officers and Procedures",
    summary: "How a service or licensee challenges a Division action in front of the Board.",
    digest: [
      "Contested-case procedure lives in this section, not in a consultant email thread.",
      "The Board hears the case. The Division is a party, not the last word.",
    ],
    watchFor: ["Skipping this chapter and treating a 90-day review letter as a final order."],
    sourceUrl: "https://publications.tnsosfiles.com/rules/1200/1200-12/1200-12-06.pdf",
  },
  {
    id: "06-03",
    citation: "1200-12-06-.03",
    title: "Petitions for Reconsideration and Stays",
    chapter: "1200-12-06",
    chapterTitle: "EMS Board Officers and Procedures",
    summary: "How to ask the Board to reconsider or stay an order.",
    digest: [
      "Reconsideration and stays are Board filings under this section.",
    ],
    watchFor: [],
    sourceUrl: "https://publications.tnsosfiles.com/rules/1200/1200-12/1200-12-06.pdf",
  },
  {
    id: "07-01",
    citation: "1200-12-07-.01",
    title: "Purpose",
    chapter: "1200-12-07",
    chapterTitle: "Community Paramedicine",
    summary: "Purpose of community paramedicine and mobile integrated healthcare: patient-centered navigation using existing resources.",
    digest: [
      "MIH focuses on patient-centered navigation by integrating existing healthcare resources.",
      "It is not a substitute 911 ambulance license.",
    ],
    watchFor: [],
    sourceUrl: "https://publications.tnsosfiles.com/rules/1200/1200-12/1200-12-07.20200315.pdf",
  },
  {
    id: "07-02",
    citation: "1200-12-07-.02",
    title: "Scope of Practice",
    chapter: "1200-12-07",
    chapterTitle: "Community Paramedicine",
    summary: "What an endorsed community paramedic may do under an approved MIH program and medical direction.",
    digest: [
      "Community paramedic scope sits on top of paramedic licensure and only inside an approved program.",
    ],
    watchFor: ["Sending a regular 911 crew to do scheduled MIH visits without the endorsement and program approval."],
    sourceUrl: "https://publications.tnsosfiles.com/rules/1200/1200-12/1200-12-07.20200315.pdf",
  },
  {
    id: "07-03",
    citation: "1200-12-07-.03",
    title: "Definitions",
    chapter: "1200-12-07",
    chapterTitle: "Community Paramedicine",
    summary: "Defined terms for community paramedic endorsement and MIH programs.",
    digest: ["Use this section's definitions when a consultant uses 'community paramedic' loosely."],
    watchFor: [],
    sourceUrl: "https://publications.tnsosfiles.com/rules/1200/1200-12/1200-12-07.20200315.pdf",
  },
  {
    id: "07-04",
    citation: "1200-12-07-.04",
    title: "Community Paramedic Applicant Requirements",
    chapter: "1200-12-07",
    chapterTitle: "Community Paramedicine",
    summary: "Unencumbered TN paramedic, five years ALS experience, Board-approved program, exam, fees, and background check.",
    digest: [
      "Must already comply with 1200-12-01 paramedic rules and hold a current unencumbered Tennessee paramedic license.",
      "At least five years of work as a paramedic with an ALS EMS service.",
      "Board-approved community paramedic training program, then the Board exam.",
      "Three fails in two years require remediation; six fails or no endorsement in two years means repeat the program.",
      "Criminal background check including sex-offender and abuse registries for the prior seven years.",
      "Only Tennessee Board-approved programs or Board-recognized equivalent out-of-state curricula count.",
    ],
    watchFor: [],
    sourceUrl: "https://publications.tnsosfiles.com/rules/1200/1200-12/1200-12-07.20200315.pdf",
  },
  {
    id: "07-05",
    citation: "1200-12-07-.05",
    title: "Endorsement Renewal, Retirement, Reactivation, and Reinstatement",
    chapter: "1200-12-07",
    chapterTitle: "Community Paramedicine",
    summary: "How the community paramedic endorsement is kept, parked, or brought back.",
    digest: [
      "The endorsement has its own renewal/retirement path in addition to the underlying paramedic license in .04 of chapter 01.",
    ],
    watchFor: [],
    sourceUrl: "https://publications.tnsosfiles.com/rules/1200/1200-12/1200-12-07.20200315.pdf",
  },
  {
    id: "07-06",
    citation: "1200-12-07-.06",
    title: "Community Paramedic Training Programs — Requirements for Approval",
    chapter: "1200-12-07",
    chapterTitle: "Community Paramedicine",
    summary: "What a training program must show the Board to be approved.",
    digest: ["Program approval is a Board file, not a handshake with a regional consultant."],
    watchFor: [],
    sourceUrl: "https://publications.tnsosfiles.com/rules/1200/1200-12/1200-12-07.20200315.pdf",
  },
  {
    id: "07-07",
    citation: "1200-12-07-.07",
    title: "Community Paramedic Training Programs — Types of Approval; Renewal",
    chapter: "1200-12-07",
    chapterTitle: "Community Paramedicine",
    summary: "Types of program approval and how approval is renewed.",
    digest: ["Approval type and renewal are in this section. A lapsed program approval is not a valid endorsement path."],
    watchFor: [],
    sourceUrl: "https://publications.tnsosfiles.com/rules/1200/1200-12/1200-12-07.20200315.pdf",
  },
  {
    id: "07-08",
    citation: "1200-12-07-.08",
    title: "Mobile Integrated Healthcare Programs — Approval",
    chapter: "1200-12-07",
    chapterTitle: "Community Paramedicine",
    summary: "Ambulance service or licensed healthcare organization must apply; medical-director letter required; approval is not transferable.",
    digest: [
      "An ambulance service or licensed healthcare organization files an application plus a letter from the medical director agreeing to advice, direction, oversight, QA, and authorization.",
      "Approval is not transferable or assignable.",
      "Deficiencies get a corrective-action plan before the Division reconsiders.",
      "Address, insurance, program director, officials, MIH medical director, or bankruptcy changes are reported within five business days.",
      "A proposed ownership or controlling-interest change is reported at least 30 days prior; the new owner files a new application.",
    ],
    watchFor: ["Running MIH visits off a 911 license without this program approval on file."],
    sourceUrl: "https://publications.tnsosfiles.com/rules/1200/1200-12/1200-12-07.20200315.pdf",
  },
];

function getRule(id) {
  return RULES.find((r) => r.id === id);
}

const STOP = new Set([
  "the","a","an","of","to","for","and","or","in","on","at","is","are","be","do","does","did",
  "when","what","how","why","where","am","i","we","my","our","you","your","it","its",
  "have","has","had","after","about","with","from","that","this","those","these",
  "need","needs","required","require","can","should","would","could","may","must",
  "get","got","use","using","want","wanted",
]);

const FAMILIES = [
  ["ambulance", "ambulances", "truck", "trucks", "unit", "units", "rig", "rigs", "vehicle", "vehicles", "bus"],
  ["reserve", "spare", "replacement", "loaner", "backup", "shop"],
  ["permit", "permits", "permitted", "permitting"],
  ["license", "licenses", "licensed", "licensure"],
  ["inventory", "inventories", "bags", "bag", "checkoff", "supplies", "stock"],
  ["meeting", "meetings", "calendar", "agenda", "agendas", "minutes"],
  ["board", "boards", "member", "members", "roster", "chair", "chairperson"],
  ["report", "reports", "reporting", "reported", "file", "filed", "filing"],
  ["accident", "accidents", "crash", "crashes", "wreck", "wrecks", "collision", "incident", "incidents"],
  ["destination", "bypass", "hospital", "ed", "trauma"],
  ["staffing", "staff", "crew", "crews"],
  ["paramedic", "paramedics", "medic", "medics", "clinician", "clinicians"],
  ["emt", "aemt"],
  ["driver", "drivers", "operator", "operators"],
  ["ce", "renewal", "hours", "credits"],
  ["posting", "posted", "stage", "staging", "county"],
  ["form", "forms", "ph3939", "ph-3939", "ph2405", "ph-2405"],
  ["consultant", "consultants", "region", "regional", "office", "division"],
];

const LOOKUP = {};
for (const family of FAMILIES) {
  for (const word of family) LOOKUP[word] = family;
}

function tokens(q) {
  return q
    .toLowerCase()
    .replace(/ph-(\d+)/g, "ph$1")
    .replace(/[^a-z0-9.]+/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP.has(w));
}

function hits(blob, word) {
  if (blob.includes(word)) return true;
  return (LOOKUP[word] ?? []).some((alias) => blob.includes(alias));
}

function matchesHay(hay, q) {
  const words = tokens(q);
  if (!words.length) return false;
  const blob = hay.toLowerCase().replace(/ph-(\d+)/g, "ph$1");
  return words.every((w) => hits(blob, w));
}

function searchRules(q) {
  if (!q.trim()) return RULES;
  return RULES.filter((r) =>
    matchesHay([r.citation, r.title, r.summary, r.chapterTitle, ...r.digest, ...r.watchFor].join(" "), q),
  );
}

const DIRECTOR = {
  name: "Brandon Ward",
  title: "Director, Office of EMS",
  phone: "615-741-4521",
  note: "Listed as Director of the Office of EMS on the EMS Compact commissioner page. Confirm on the state EMS site.",
};

const BOARD_SOURCE = "https://www.tn.gov/health/licensure/ems.html";
const BOARD_CALENDAR = "https://www.tn.gov/health/calendar.emergency-medical-services.html";

const BOARD_MEMBERS = [
  { name: "Greg Miller", role: "Chairperson", seat: "Paramedic director of a private ambulance service", term: "listed 6/30/24" },
  { name: "Jason Tunstall", role: "Co-chairperson", seat: "Medical first response or transport", term: "listed 6/30/26" },
  { name: "Jared McKinney, M.D.", role: "Board member", seat: "Physician", term: "listed 6/30/24" },
  { name: "Jeanie D. Diden, R.N.", role: "Board member", seat: "Air medical registered nurse", term: "listed 6/30/24" },
  { name: "Glenda “Joyce” Noles", role: "Board member", seat: "Administrator or hospital-based ambulance service", term: "listed 6/30/24" },
  { name: "Steve Hamby", role: "Board member", seat: "Paramedic director of a government-based ambulance service", term: "listed 6/30/25" },
  { name: "Robert “Chris” Wheat", role: "Board member", seat: "Medical first responder or transport", term: "listed 6/30/25" },
  { name: "Jeffery Bagwell", role: "Board member", seat: "Medical first response employed by a fire service", term: "listed 6/30/25" },
  { name: "William “Drew” Hooker", role: "Board member", seat: "Ambulance service official of a county", term: "listed 6/30/26" },
  { name: "Tim Bell", role: "Board member", seat: "Rescue squad", term: "listed 6/30/26" },
  { name: "David Blevins", role: "Board member", seat: "Program director EMT/paramedic", term: "listed 6/30/27" },
  { name: "Stacy Prater", role: "Board member", seat: "Program director", term: "listed 6/30/27" },
  { name: "Shannon Morphis", role: "Board member", seat: "Paramedic / community paramedicine", term: "listed 6/30/27" },
];

const OFFICE = {
  name: "Tennessee Office of Emergency Medical Services",
  address: "665 Mainstream Drive, 1st Floor, Nashville, TN 37243",
  phone: "615-741-2584",
  tollFree: "1-800-778-4505",
  fax: "615-741-4217",
  email: "health.ems@tn.gov",
  site: "https://www.tn.gov/health/licensure/ems.html",
  rules: "https://publications.tnsosfiles.com/rules/1200/1200-12/1200-12.htm",
  directory: "https://internet.health.tn.gov/EMSDirectory",
  medicalDirector: "Joe Holley, M.D., FACEP",
  dataManager: {
    name: "Britnei Outland",
    email: "britnei.outland@tn.gov",
    office: "615-532-4572",
    cell: "615-879-1312",
  },
  radio: {
    name: "Vince Cuevas",
    email: "vincent.cuevas@tn.gov",
    phone: "615-906-5068",
  },
  tnpap: {
    name: "Tennessee Professional Assistance Program",
    phone: "615-726-4001",
    tollFree: "1-888-776-0786",
    site: "https://www.tnpap.org/",
    address: "545 Mainstream Drive, Suite 414, Nashville, TN 37228",
  },
};

const SITE_FACTS = [
  "Only a licensed ambulance service is issued vehicle permits.",
  "Each ambulance that operates under a license must pass an EMS Office inspection and is separately permitted to that license.",
  "A separate service license is required for the county of the base of operations. Permits ride on that license.",
  "Licenses and permits renew by July 1 each year. Renewal packets are mailed in the spring.",
  "Fleet changes use PH-3939. Mechanical inspections use PH-2405.",
  "The Board adopts rules and hears contested cases. Consultants inspect and advise. A consultant email is not a Board order.",
];

const REGIONS = [
  {
    id: "ne",
    name: "Northeast",
    consultant: "John Dabbs",
    phone: "423-737-1992",
    email: "john.dabbs@tn.gov",
    address: "185 Treasure Lane, Johnson City, TN 37604",
  },
  {
    id: "east",
    name: "East",
    consultant: "Jonathan Beaty",
    phone: "865-235-6360",
    email: "jonathan.beaty@tn.gov",
    address: "P.O. Box 343, 1103 Knoxville Hwy., Wartburg, TN 37887",
  },
  {
    id: "se",
    name: "Southeast",
    consultant: "Nita Jernigan",
    phone: "423-737-4112",
    email: "nita.jernigan@tn.gov",
    address: "1301 Riverfront Parkway, Suite 209, Chattanooga, TN 37402",
  },
  {
    id: "uc",
    name: "Upper Cumberland",
    consultant: "Brian Tompkins",
    phone: "931-216-3999",
    email: "brian.tompkins@tn.gov",
    address: "1100 England Drive, Cookeville, TN 38501",
  },
  {
    id: "mid",
    name: "Mid-Cumberland",
    consultant: "Dwight Davis",
    phone: "615-828-5206",
    email: "dwight.n.davis@tn.gov",
    address: "665 Mainstream Drive, Nashville, TN 37247",
  },
  {
    id: "sc",
    name: "South Central",
    consultant: "Vacant on Nov 2023 list",
    phone: "615-741-2584",
    email: "health.ems@tn.gov",
    address: "1216 Trotwood Avenue, Columbia, TN 38401",
  },
  {
    id: "west",
    name: "West",
    consultant: "Kevin Cagle",
    phone: "731-267-1111",
    email: "kevin.cagle@tn.gov",
    address: "295 Summar Dr., 2nd Floor, Jackson, TN 38301",
  },
  {
    id: "delta",
    name: "Memphis-Delta",
    consultant: "Mike Duck",
    phone: "901-212-4444",
    email: "james.duck@tn.gov",
    address: "295 Summar Dr., 2nd Floor, Jackson, TN 38301",
  },
  {
    id: "al",
    name: "Consultant-at-large",
    consultant: "Russell Gupton",
    phone: "615-864-3389",
    email: "russell.d.gupton@tn.gov",
    address: "665 Mainstream Drive, Nashville, TN 37243",
  },
];

const T = "https://www.tn.gov";

const FORMS = [
  { id: "incident", name: "Ambulance Services Incident Report", number: "online", group: "Service license", href: "https://stateoftennessee.formstack.com/forms/ambulance_services_incident_reports" },
  { id: "ph3987", name: "Initial Ambulance Service Application", number: "PH-3987", group: "Service license", href: `${T}/content/dam/tn/health/healthprofboards/ems/PH-3987-Initial-GRND-Srvc-Lic-APP.pdf` },
  { id: "ph4242", name: "Initial Ambulance Service Review", number: "PH-4242", group: "Service license", href: `${T}/content/dam/tn/health/healthprofboards/ems/PH-4242-Initial-Srv-Review-Rev.pdf` },
  { id: "ph4238", name: "90-Day Ambulance Service Review", number: "PH-4238", group: "Service license", href: `${T}/content/dam/tn/health/healthprofboards/ems/PH-4238-90-Day-Audit-Rev.pdf` },
  { id: "ph4318", name: "Ground Ambulance Renewal", number: "PH-4318", group: "Service license", href: `${T}/content/dam/tn/health/events/PH-4318%20GRND%20Amb%20Renewal%20Appl%203-2024.pdf` },
  { id: "ph3939", name: "Notification of Fleet Changes", number: "PH-3939", group: "Vehicles", href: `${T}/content/dam/tn/health/events/PH-3939%20Notice%20of%20Fleet%20Change%209-2023.pdf` },
  { id: "ph2405", name: "Mechanical Inspection", number: "PH-2405", group: "Vehicles", href: `${T}/content/dam/tn/health/healthprofboards/ems/PH-2405-Mechanical-Inspection-Form.pdf` },
  { id: "ph3941", name: "Neonatal Inspection Supplement", number: "PH-3941", group: "Vehicles", href: `${T}/content/dam/tn/health/healthprofboards/ems/PH-3941-Neonatal-Inspec-Splmnt.pdf` },
  { id: "ph4073", name: "Initial Air Service Application", number: "PH-4073", group: "Air / invalid", href: `${T}/content/dam/tn/health/healthprofboards/ems/PH-4073-Initial-AIR-Svc-APP.pdf` },
  { id: "ph4243", name: "Air Ambulance Audit", number: "PH-4243", group: "Air / invalid", href: `${T}/content/dam/tn/health/healthprofboards/ems/PH-4243-AIR-Amb-Audit-Form.pdf` },
  { id: "ph4317", name: "Air Ambulance Renewal", number: "PH-4317", group: "Air / invalid", href: `${T}/content/dam/tn/health/events/PH-4317%20AIR%20Amb%20Renewal%20Appl%203-2024.pdf` },
  { id: "ph4070", name: "Initial Invalid Service Application", number: "PH-4070", group: "Air / invalid", href: `${T}/content/dam/tn/health/events/PH-4070%20Initial%20INVALID%20Srvc%20APP%202.2025.doc` },
  { id: "ph4237", name: "Initial Invalid Service Review", number: "PH-4237", group: "Air / invalid", href: `${T}/content/dam/tn/health/healthprofboards/ems/PH-4237-Initial-Invalid-Srv-Review.pdf` },
  { id: "ph4244", name: "90-Day Invalid Service Review", number: "PH-4244", group: "Air / invalid", href: `${T}/content/dam/tn/health/healthprofboards/ems/PH-4244-90-Day-Invalid-Srv-Review-Rev.pdf` },
  { id: "ph4236", name: "Annual Invalid Service Audit", number: "PH-4236", group: "Air / invalid", href: `${T}/content/dam/tn/health/healthprofboards/ems/PH-4236-INVALID-Srv-Audit-Form.pdf` },
  { id: "ph4316", name: "Invalid Service Renewal", number: "PH-4316", group: "Air / invalid", href: `${T}/content/dam/tn/health/events/PH-4316%20INVALID%20Renewal%20App%203-2024.pdf` },
  { id: "ph2397", name: "EMS Application and Fees", number: "PH-2397", group: "Personnel", href: `${T}/content/dam/tn/health/docs/PH-2397.docx` },
  { id: "ph3940", name: "Miscellaneous Fees", number: "PH-3940", group: "Personnel", href: `${T}/content/dam/tn/health/events/PH-3940%20Miscellaneous%20Fees%206-2026.docx` },
  { id: "ph4072", name: "Affidavit to Downgrade", number: "PH-4072", group: "Personnel", href: `${T}/content/dam/tn/health/events/PH-4072%20Affidavit%20of%20Downgrade%206-2026.docx` },
  { id: "ph3932", name: "Affidavit to Retire License", number: "PH-3932", group: "Personnel", href: `${T}/content/dam/tn/health/events/PH-3932%20Affidavit%20of%20Retirement%206-2026.docx` },
  { id: "ph3856", name: "Criminal Background Disclosure", number: "PH-3856", group: "Personnel", href: `${T}/content/dam/tn/health/events/PH-3856%20Criminal%20Background%20Disclosure%206-2026.docx` },
  { id: "ph4183", name: "Declaration of Citizenship", number: "PH-4183A", group: "Personnel", href: `${T}/content/dam/tn/health/events/PH-4183A%20Declaration%20of%20Citizenship%2011-2024%20ADA.docx` },
  { id: "ph4291", name: "Statement of Licensure Level", number: "PH-4291", group: "Personnel", href: `${T}/content/dam/tn/health/events/PH-4291%20Statement%20of%20Licensure%20Level%206.2026%20ADA.docx` },
  { id: "ph0130", name: "Medical Statement", number: "PH-0130", group: "Personnel", href: `${T}/content/dam/tn/health/events/PH-0130%20Medical%20Statement%20(Rev-6-2026)%20ADA-WebRev.docx` },
  { id: "roster", name: "Student Enrollment Roster (service training)", number: "PH-Pending", group: "Education", href: `${T}/content/dam/tn/health/events/PH-Pending%20Stud%20Enroll%20Roster-Amb%20Train%20Ctr%201.2020.pdf` },
  { id: "ph4462", name: "Student Enrollment Invoice (service training)", number: "PH-4462", group: "Education", href: `${T}/content/dam/tn/health/events/PH-Pending%20Stud%20Enroll%20Invoice-Amb%20Train%20Ctr%201.2020.pdf` },
  { id: "mdsupp", name: "EMS Medical Director Supplemental Application", number: "MD", group: "Medical director", href: `${T}/content/dam/tn/health/documents/EMSDSUpp_App.pdf` },
  { id: "mdliab", name: "EMS Medical Director Professional Liability", number: "MD", group: "Medical director", href: `${T}/content/dam/tn/health/documents/EMSDProf_Liab.pdf` },
  { id: "mdag", name: "Sample EMS Medical Director Agreement", number: "sample", group: "Medical director", href: `${T}/content/dam/tn/health/documents/SampleEMSMDAgreement.pdf` },
  { id: "mdct", name: "Sample Medical Director Contract", number: "sample", group: "Medical director", href: `${T}/content/dam/tn/health/documents/SampleEMSMDSampleContract.pdf` },
];

const PROTOCOLS = [
  { label: "TN EMS Protocol Guidelines (Sept 2025)", href: `${T}/content/dam/tn/health/events/TN%20State%20Guidelines%202024-2025%2009.11.2025.pdf` },
  { label: "EMS Board Position Statements (2025)", href: `${T}/content/dam/tn/health/docs/EMS-Board-Position-Statements-2025.docx` },
  { label: "Approved clinical practices (Dec 2024)", href: `${T}/content/dam/tn/health/events/All%20Clinical%20Practices%20Docs%20December%202024.pdf` },
  { label: "Infectious disease specimen collection (2020)", href: `${T}/content/dam/tn/health/healthprofboards/ems/Specimen-Collection-by-EMS-Clinical-Practice-2020.pdf` },
  { label: "Adrenal insufficiency protocol", href: `${T}/content/dam/tn/health/documents/EMS_Adrenal_Insufficiency_Protocol_Guideline.pdf` },
  { label: "Hazardous materials protocol guidelines", href: `${T}/content/dam/tn/health/documents/EMS_HazMatProtocols.pdf` },
  { label: "RSI quality review", href: `${T}/content/dam/tn/health/documents/RSI_Quality_Review_State_EMS_2010.pdf` },
  { label: "TN-NAEMSP crisis care matrix", href: `${T}/content/dam/tn/health/events/TN-NAEMSP%20Crisis%20Care%20Matrix.pdf` },
  { label: "TN-NAEMSP ketamine utilization", href: `${T}/content/dam/tn/health/events/TN-NAEMSP%20Ketamine%20Utilization.pdf` },
];

const LINKS = [
  { label: "Official EMS Board site", href: OFFICE.site },
  { label: "Published 1200-12 rules", href: OFFICE.rules },
  { label: "Licensed service directory", href: OFFICE.directory },
  { label: "CE Broker (free Board account)", href: "https://cebroker.com/" },
  { label: "TNEMSIS / NEMSIS Tennessee", href: "https://nemsis.org/state-data-managers/state-map-v3/tennessee/" },
  { label: "EMS Compact", href: "https://www.emscompact.gov/" },
  { label: "TNPAP peer assistance", href: OFFICE.tnpap.site },
  { label: "Licensure scam alert (TDH)", href: `${T}/health/licensure/ems.html` },
];

const BOARD_NOTE =
  "The EMS Board adopts the rules. Regional consultants inspect and advise. A consultant letter is not a Board order. Contested cases are in 1200-12-06.";

const SCENARIOS = [
  {
    id: "reserve-temp",
    title: "Reserve / replacement ambulance",
    question: "Can we put a reserve or shop-replacement truck in service without a new annual permit?",
    status: "conditional",
    short:
      "A standing spare that answers calls needs its own permit. A shop fill-in and a newly titled replacement have written temporary paths in 1200-12-01-.02(5). An invalid van is not an ambulance.",
    steps: [
      "Each ambulance that operates under the service license must be inspected and separately permitted. The official site states that only a licensed service is issued vehicle permits, and each operating ambulance is permitted to that license. Cite 1200-12-01-.02 and 1200-12-01-.14.",
      "A truck that lives in the bay all year and takes calls whenever you are short is a fleet add. Pay the vehicle permit fee in 1200-12-01-.06, pass inspection (mechanical form PH-2405), and file Notification of Fleet Changes PH-3939. That is the permitted spare.",
      "Temporary substitute when a permitted unit is out for repair or maintenance: allowed under 1200-12-01-.02(5)(a) even if the service does not own the loaner. Immediate written notice to the Division is required when it is placed in service, with the substitute license and vehicle ID and the permit number it is covering. Cite 1200-12-01-.02(5)(c). Insurance must be in force. The truck must meet .02 design, marking, lighting, radio, and mechanical standards and carry the .03 equipment list for the licensed level.",
      "Newly acquired replacement after title conversion: may operate up to 15 days pending inspection after the fee and vehicle information are submitted. Cite 1200-12-01-.02(5)(b). Same written notice items as above.",
      "Adding a vehicle to extend the fleet is not a temporary authorization. It needs fees, inspection, and a permit. A Division letter of approval is not a permit for more than 90 days. Cite 1200-12-01-.02(5)(d) and (5)(e).",
      "An invalid vehicle under 1200-12-01-.09 is a different class. It is not a reserve ambulance. A first-response truck under .16 is not a transport unit.",
      "1200-12 does not create an unpermitted 911 reserve. If someone tells you a shop loaner is automatically illegal, point to .02(5). If someone tells you a parked unpermitted truck can take calls all year, that sentence is not in the rule.",
    ],
    citations: ["1200-12-01-.02", "1200-12-01-.03", "1200-12-01-.06", "1200-12-01-.09", "1200-12-01-.14"],
    phrases: "spare truck reserve ambulance loaner shop replacement unpermitted backup rig PH-3939 fleet change",
  },
  {
    id: "one-medic",
    title: "Single clinician plus driver",
    question: "Can we staff a truck with one paramedic (or one EMT/AEMT) and a driver?",
    status: "conditional",
    short:
      "Category B Levels 1–4 write a single-clinician-plus-operator option after medical-director notice. Category A primary 911 staffing is the published percent-of-runs table. The operator still has to meet 1200-12-01-.10.",
    steps: [
      "Read the service license. Category A is the local-government primary 911 provider. Category B is licensed transport. Levels 1–4 set how emergency runs are staffed. Cite 1200-12-01-.14.",
      "Category B Level 1 and 2: a paramedic may be the sole medical staff with a qualified operator after the service medical director notifies the Office of EMS of that configuration. Cite 1200-12-01-.14.",
      "Category B Level 3 and 4: a parallel option exists for BLS work with one EMT or AEMT plus an operator, also after medical-director notice to the Office.",
      "The operator is not 'anyone with a Class D.' 1200-12-01-.10 requires the ambulance-driver qualifications, current CPR, a defensive driving or emergency vehicle operations course, and demonstrated competency.",
      "Category A levels keep the published percent-of-emergency-runs staffing (paramedic plus EMT on Level 1, and the lower-level pairs as written). Do not import the Category B exception onto a Category A license unless .14 says that level has it.",
      "Patients are not transported until the service is licensed. Using a second party to dodge a denied license or an inspection is forbidden in .14.",
      "If a consultant says two licensed clinicians are always required, ask which subsection. The single-clinician sentences are in .14, not in a hallway rule.",
    ],
    citations: ["1200-12-01-.14", "1200-12-01-.10"],
    phrases: "one medic one paramedic driver only operator single clinician staffing two person crew",
  },
  {
    id: "inventory",
    title: "Equipment inventory frequency",
    question: "Do we have to inventory every truck every shift?",
    status: "allowed",
    short:
      "The state minimum is a recorded inventory at least every three days on each vehicle, kept available for three months. Shift checks can be service policy. They are not the Board minimum.",
    steps: [
      "1200-12-01-.15(4) says an ambulance equipment inventory shall be recorded not less than every three days for each vehicle, showing patient-care equipment, safety devices, and supplies.",
      "Use a service form. Keep those records available for inspection covering at least the last three months.",
      "Each permitted vehicle still has to carry the equipment, medications, and supplies in 1200-12-01-.03 as posted by the Division for that licensed level. Inventory frequency and the required list are separate duties.",
      "Mechanical safety inspections and out-of-service failures live in 1200-12-01-.02, not in the three-day supply count.",
      "Concealing equipment deficiencies is listed under unethical conduct in 1200-12-01-.17.",
      "A consultant can prefer daily logs as a recommendation. Daily is not the sentence in .15(4). Write extra frequency as service policy so it is not confused with the Board minimum.",
    ],
    citations: ["1200-12-01-.15", "1200-12-01-.03", "1200-12-01-.02", "1200-12-01-.17"],
    phrases: "how often bags check off inventory every shift daily supplies equipment count",
  },
  {
    id: "destination",
    title: "Taking a patient to the local hospital",
    question: "Are we required to bypass the local ED on every sick call?",
    status: "conditional",
    short:
      "Bypass is written for trauma and pediatric-emergency criteria in 1200-12-01-.21. Patients who do not meet those steps go to the most appropriate facility under local or regional guidelines and medical control.",
    steps: [
      "Trauma patients go to the most appropriate trauma center under regional triage or direct medical direction. A closer undesignated hospital may be bypassed. Cite 1200-12-01-.21.",
      "Pediatric Step One or Step Two trauma is directed toward a Level I trauma center or a Comprehensive Regional Pediatric Center. Trauma Medical Control may grant a 30-minute ground exception.",
      "Contaminated patients are not transported until they are decontaminated.",
      "Patients who do not meet trauma or CRPC criteria go to the most appropriate facility under local or regional guidelines. That can be the local ED.",
      "Trauma Medical Control may redirect for overload. A refusal or a redirection that is not a refusal of care does not by itself violate .21.",
      "1200-12-01-.21 does not require bypass of the local hospital on every sick or injured call. If someone states a blanket bypass rule, ask which trauma or pediatric step they are applying.",
    ],
    citations: ["1200-12-01-.21"],
    phrases: "bypass local hospital destination trauma pediatric take patient to er ed",
  },
  {
    id: "board-meetings",
    title: "When are the Board meetings",
    question: "When does the EMS Board meet?",
    status: "allowed",
    short:
      "1200-12 does not print the calendar. Dates, agendas, minutes, and the livestream are on the state EMS site. Chapter 06 is what the Board does when it sits.",
    steps: [
      "Open tn.gov/health/licensure/ems and use Meeting Schedule and Meeting Minutes. That is the controlling calendar. It is not in the compilation PDF.",
      "1200-12-06-.01 is the chair's role. 1200-12-06-.02 is contested-case procedure before the Board. 1200-12-06-.03 is petitions for reconsideration and stays.",
      "The Board adopts rules and hears contested cases. A regional consultant inspection or an Office letter is not a Board meeting and is not a Board order.",
      "If you need a rule change, a contested case, or an agenda item, put the request in writing to the Office and keep it in the service file.",
      "Do not treat a hallway answer as a substitute for a Board action under chapter 06.",
    ],
    citations: ["1200-12-06-.01", "1200-12-06-.02", "1200-12-06-.03"],
    phrases: "when are board meetings meeting schedule calendar agenda minutes ems board members roster chair",
  },
  {
    id: "required-reports",
    title: "What am I required to report",
    question: "What reports does a licensed ambulance service have to file?",
    status: "allowed",
    short:
      "1200-12 requires the annual operations report, electronic run data within 60 days, a hospital copy with the patient or within 24 hours, and a written incident file to the Division within five business days when a patient is seriously injured by something other than their illness. Crashes are a separate Safety filing when the crash statute is triggered.",
    steps: [
      "Annual operations report to the Division, on the form they issue. Cite 1200-12-01-.11(3).",
      "Every response or patient contact: keep a dispatch log (times, unit, crew name and level, emergency vs transfer) for ten years. Cite 1200-12-01-.15(2)(a).",
      "File the Board-approved electronic run report with the Division within 60 days. A deficiency notice goes out at 15 days if the file is late or incomplete. Cite 1200-12-01-.15(2)(b).",
      "Leave a hospital report with the receiving ED (name if known, age, gender, origin, times, complaint, vitals, care, crew, unit). If you cannot leave it on arrival, give a signed-for verbal report before you leave and submit the written copy within 24 hours. Cite 1200-12-01-.15(2)(c).",
      "Within five business days of discovery, send the Division a written incident report when a patient is seriously injured in a way that could not reasonably be expected from their condition. The rule names medication errors, failure to follow service protocols, and major medical or communications device failure or user error that causes serious injury or a delay in response or treatment. Use the Ambulance Services Incident Report on the state EMS site. Cite 1200-12-01-.15(2)(d).",
      "1200-12 does not create a separate crash form for every ambulance fender-bender. A wreck that injures a patient, or a device failure that delays care, is the five-day incident in .15(2)(d). A wreck that meets T.C.A. Title 55 crash-reporting thresholds is filed with the Department of Safety as an owner/operator report, in addition to the local police report. That Safety filing is not an EMS Board form.",
      "Immediate written notice to the Division when a temporary or replacement ambulance is placed in service (license, VIN, and the permit number it is covering). Fleet adds and drops use PH-3939. Cite 1200-12-01-.02.",
      "Keep personnel files, vehicle maintenance and title records, three-day equipment inventories, and FCC radio records on site for inspection. Cite 1200-12-01-.15(1), (3), (4), (5).",
      "If the service runs an AED program under 1200-12-01-.19, each AED use is reported to the responding EMS agency and the supervising physician.",
      "Chapter 1200-12-02 has its own reports when disaster or chemical-agent procedures are used.",
    ],
    citations: [
      "1200-12-01-.15",
      "1200-12-01-.11",
      "1200-12-01-.02",
      "1200-12-01-.19",
      "1200-12-02-.04",
    ],
    phrases: "what am i required to report accident crash wreck incident annual run report ePCR hospital copy five days",
  },
];

window.CHAPTERS = CHAPTERS;
window.RULES = RULES;
window.SCENARIOS = SCENARIOS;
window.FORMS = FORMS;
window.REGIONS = REGIONS;
window.OFFICE = OFFICE;
window.DIRECTOR = DIRECTOR;
window.BOARD_MEMBERS = BOARD_MEMBERS;
window.BOARD_CALENDAR = BOARD_CALENDAR;
window.BOARD_NOTE = BOARD_NOTE;
window.PROTOCOLS = PROTOCOLS;
window.LINKS = LINKS;
window.getRule = getRule;
window.searchRules = searchRules;
window.matchesHay = matchesHay;
