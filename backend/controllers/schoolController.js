// controllers/schoolController.js
import asyncHandler from "express-async-handler";
import School from "../models/School.js";

// @desc    Get all school items
// @route   GET /api/school
// @access  Public
const getSchoolItems = asyncHandler(async (req, res) => {
  const schoolItems = await School.find({});
  res.json(schoolItems);
});

// @desc    Create a new school item
// @route   POST /api/school
// @access  Private
const createSchoolItem = asyncHandler(async (req, res) => {
  const {
    shortName,
    name,
    address,
    email,
    headMasterName,
    box,
    phone,
    helpDeskNo,
    year,
    senderID,
    admissionOpeningDateTime,
    schOpeningDateTime,
    academicYear,
    acceptOnlinePayment,
    serviceCharge,
    allowUploadPictures,
    autoStudentHousing,
    allowStudentClassSelection,
    admissionStatus,
    announcement,
    showMedicalUndertaking,
    showProgramSubject,
    personalRecordsCaption,
    UndertakingMedicalCaption,
    programSubjectCaption,
    notes,
  } = req.body;

  const schoolItem = await School.create({
    shortName,
    name,
    address,
    email,
    headMasterName,
    box,
    phone,
    helpDeskNo,
    year,
    senderID,
    admissionOpeningDateTime: new Date(admissionOpeningDateTime),
    schOpeningDateTime: new Date(schOpeningDateTime),
    academicYear,
    acceptOnlinePayment,
    serviceCharge,
    allowUploadPictures,
    autoStudentHousing,
    allowStudentClassSelection,
    admissionStatus,
    announcement,
    showMedicalUndertaking,
    showProgramSubject,
    personalRecordsCaption,
    UndertakingMedicalCaption,
    programSubjectCaption,
    notes,
  });

  if (schoolItem) {
    res.status(201).json(schoolItem);
  } else {
    res.status(400);
    throw new Error("Invalid school item data");
  }
});

// @desc    Update a school item
// @route   PUT /api/school/:id
// @access  Private
const updateSchoolItem = asyncHandler(async (req, res) => {
  const {
    shortName,
    name,
    address,
    email,
    headMasterName,
    box,
    phone,
    helpDeskNo,
    year,
    senderID,
    admissionOpeningDateTime,
    schOpeningDateTime,
    academicYear,
    acceptOnlinePayment,
    serviceCharge,
    allowUploadPictures,
    autoStudentHousing,
    allowStudentClassSelection,
    admissionStatus,
    announcement,
    showMedicalUndertaking,
    showProgramSubject,
    personalRecordsCaption,
    UndertakingMedicalCaption,
    programSubjectCaption,
    notes,
    prospectus,
    undertaking,
  } = req.body;

  const schoolItem = await School.findById(req.params.id);

  if (schoolItem) {
    schoolItem.prospectus = prospectus || schoolItem.prospectus;
    schoolItem.undertaking = undertaking || schoolItem.undertaking;
    schoolItem.personalRecordsCaption =
      personalRecordsCaption || schoolItem.personalRecordsCaption;
    schoolItem.UndertakingMedicalCaption =
      UndertakingMedicalCaption || schoolItem.UndertakingMedicalCaption;
    schoolItem.notes = notes || schoolItem.notes;
    schoolItem.programSubjectCaption =
      programSubjectCaption || schoolItem.programSubjectCaption;
    schoolItem.name = name || schoolItem.name;
    schoolItem.address = address || schoolItem.address;
    schoolItem.serviceCharge = serviceCharge || schoolItem.serviceCharge;
    schoolItem.email = email || schoolItem.email;
    schoolItem.headMasterName = headMasterName || schoolItem.headMasterName;
    schoolItem.box = box || schoolItem.box;
    schoolItem.shortName = shortName || schoolItem.shortName;
    schoolItem.phone = phone || schoolItem.phone;
    schoolItem.helpDeskNo = helpDeskNo || schoolItem.helpDeskNo;
    schoolItem.year = year || schoolItem.year;
    schoolItem.senderID = senderID || schoolItem.senderID;
    schoolItem.admissionOpeningDateTime = admissionOpeningDateTime
      ? new Date(admissionOpeningDateTime)
      : schoolItem.admissionOpeningDateTime;
    schoolItem.schOpeningDateTime = schOpeningDateTime
      ? new Date(schOpeningDateTime)
      : schoolItem.schOpeningDateTime;
    schoolItem.academicYear = academicYear || schoolItem.academicYear;

    // Convert to boolean or use existing value
    schoolItem.acceptOnlinePayment =
      acceptOnlinePayment === ""
        ? schoolItem.acceptOnlinePayment
        : Boolean(acceptOnlinePayment);

    schoolItem.showMedicalUndertaking =
      showMedicalUndertaking === ""
        ? schoolItem.showMedicalUndertaking
        : Boolean(showMedicalUndertaking);

    schoolItem.showProgramSubject =
      showProgramSubject === ""
        ? schoolItem.showProgramSubject
        : Boolean(showProgramSubject);

    // schoolItem.serviceCharge =
    //   serviceCharge === "" ? schoolItem.serviceCharge : serviceCharge;

    schoolItem.allowUploadPictures =
      allowUploadPictures === ""
        ? schoolItem.allowUploadPictures
        : Boolean(allowUploadPictures);

    schoolItem.autoStudentHousing =
      autoStudentHousing === ""
        ? schoolItem.autoStudentHousing
        : Boolean(autoStudentHousing);

    schoolItem.allowStudentClassSelection =
      allowStudentClassSelection === ""
        ? schoolItem.allowStudentClassSelection
        : Boolean(allowStudentClassSelection);

    schoolItem.admissionStatus =
      admissionStatus === ""
        ? schoolItem.admissionStatus
        : Boolean(admissionStatus);

    schoolItem.announcement = announcement || schoolItem.announcement;

    const updatedSchoolItem = await schoolItem.save();
    res.json(updatedSchoolItem);
  } else {
    res.status(404);
    throw new Error("School item not found");
  }
});

// @desc    Delete a school item
// @route   DELETE /api/school/:id
// @access  Private
const deleteSchoolItem = asyncHandler(async (req, res) => {
  try {
    const schoolItem = await School.findById(req.params.id);

    if (schoolItem) {
      await School.deleteOne({ _id: req.params.id });
      res.json({ message: "School item removed" });
    } else {
      res.status(404);
      throw new Error("School item not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export { getSchoolItems, createSchoolItem, updateSchoolItem, deleteSchoolItem };
