# Interview & Offer Modals Documentation

## Overview
Created beautiful, user-friendly modals for companies to schedule interviews and send job offers to students with all necessary details.

## Components Created

### 1. ScheduleInterviewModal
**File**: `frontend/components/ScheduleInterviewModal.js`

Beautiful modal for scheduling interviews with students.

#### Features:
- ✅ **Interview Type Selection**
  - In-Person (สัมภาษณ์ที่บริษัท)
  - Video Call (สัมภาษณ์ออนไลน์)
  - Phone Interview (สัมภาษณ์ทางโทรศัพท์)

- ✅ **Date & Time Picker**
  - Date validation (cannot select past dates)
  - Time selection
  - Duration selection (30min - 2hrs)

- ✅ **Location/Video Link**
  - For in-person: Address input
  - For video: Video link + Meeting ID

- ✅ **Interviewer Information**
  - Name (required)
  - Email
  - Phone number

- ✅ **Instructions & Preparation**
  - Instructions for student
  - Preparation notes

#### Data Structure:
```javascript
{
  applicationId: UUID,
  studentId: UUID,
  companyId: UUID,
  positionId: UUID,
  interviewType: "IN_PERSON" | "VIDEO" | "PHONE",
  interviewDate: ISO_STRING,
  interviewDuration: NUMBER (minutes),
  location: STRING (for in-person),
  videoLink: STRING (for video),
  meetingId: STRING (for video),
  interviewerName: STRING,
  interviewerEmail: STRING,
  interviewerPhone: STRING,
  instructions: TEXT,
  preparationNotes: TEXT,
  status: "SCHEDULED"
}
```

### 2. SendOfferModal
**File**: `frontend/components/SendOfferModal.js`

Beautiful modal for sending job offers to students.

#### Features:
- ✅ **Position Details**
  - Job title
  - Pre-filled from application

- ✅ **Compensation**
  - Allowance amount
  - Currency selection (THB, USD, EUR)
  - Real-time formatting (15,000 บาท/เดือน)

- ✅ **Duration**
  - Start date
  - End date
  - Auto-calculate duration (X months Y days)

- ✅ **Terms & Conditions**
  - Detailed terms textarea
  - Work hours, benefits, responsibilities

- ✅ **Response Deadline**
  - Date picker
  - Time picker
  - Warning about expiration

#### Data Structure:
```javascript
{
  applicationId: UUID,
  title: STRING,
  allowanceAmount: NUMBER,
  allowanceCurrency: "THB" | "USD" | "EUR",
  startsOn: DATE_STRING (YYYY-MM-DD),
  endsOn: DATE_STRING (YYYY-MM-DD),
  termsText: TEXT,
  responseDeadline: ISO_STRING,
  status: "PENDING"
}
```

## Usage Examples

### In Company Applicants Page

```javascript
import ScheduleInterviewModal from "@/components/ScheduleInterviewModal";
import SendOfferModal from "@/components/SendOfferModal";

function ApplicantsPage() {
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);

  const handleScheduleInterview = (application) => {
    setSelectedApplication(application);
    setShowInterviewModal(true);
  };

  const handleSendOffer = (application) => {
    setSelectedApplication(application);
    setShowOfferModal(true);
  };

  return (
    <>
      {/* Applicant list with action buttons */}
      <button onClick={() => handleScheduleInterview(app)}>
        <i className="fas fa-calendar-check"></i>
        นัดสัมภาษณ์
      </button>
      
      <button onClick={() => handleSendOffer(app)}>
        <i className="fas fa-file-contract"></i>
        ส่ง Offer
      </button>

      {/* Modals */}
      {showInterviewModal && (
        <ScheduleInterviewModal
          application={selectedApplication}
          onClose={() => setShowInterviewModal(false)}
          onSuccess={() => {
            // Refresh data
            fetchApplications();
          }}
        />
      )}

      {showOfferModal && (
        <SendOfferModal
          application={selectedApplication}
          onClose={() => setShowOfferModal(false)}
          onSuccess={() => {
            // Refresh data
            fetchApplications();
          }}
        />
      )}
    </>
  );
}
```

### In Recruitment/ATS Page

```javascript
// When changing status to INTERVIEW_SCHEDULED
if (newStatus === "INTERVIEW_SCHEDULED") {
  setSelectedApplication(application);
  setShowInterviewModal(true);
}

// When changing status to OFFER_EXTENDED
if (newStatus === "OFFER_EXTENDED") {
  setSelectedApplication(application);
  setShowOfferModal(true);
}
```

## UI/UX Features

### Design Elements:
- ✅ **Modern & Clean**
  - Rounded corners (16px)
  - Soft shadows
  - Smooth transitions

- ✅ **Color Coding**
  - Interview: Blue (#2563EB)
  - Offer: Green (#10B981)
  - Warning: Yellow (#F59E0B)

- ✅ **Icons**
  - FontAwesome icons throughout
  - Visual hierarchy
  - Better recognition

- ✅ **Responsive**
  - Max width 700px
  - Scrollable content
  - Mobile-friendly

- ✅ **Validation**
  - Required fields marked with *
  - Date validation (no past dates)
  - Real-time feedback

- ✅ **Loading States**
  - Spinner during submission
  - Disabled buttons
  - Clear feedback

### User Experience:
- ✅ **Smart Defaults**
  - Pre-filled position title
  - Default currency (THB)
  - Default duration (60 min)

- ✅ **Helpful Hints**
  - Placeholder text with examples
  - Info boxes with tips
  - Duration calculator

- ✅ **Error Handling**
  - Toast notifications
  - Success/error messages
  - Clear error states

## Backend Integration

### Interview Endpoint
```
POST /api/v1/interviews
Authorization: Bearer <token>
Content-Type: application/json

Body: {
  applicationId, studentId, companyId, positionId,
  interviewType, interviewDate, interviewDuration,
  location, videoLink, meetingId,
  interviewerName, interviewerEmail, interviewerPhone,
  instructions, preparationNotes, status
}

Response: Interview object
```

### Offer Endpoint
```
POST /api/v1/offers
Authorization: Bearer <token>
Content-Type: application/json

Body: {
  applicationId, title, allowanceAmount, allowanceCurrency,
  startsOn, endsOn, termsText, responseDeadline, status
}

Response: Offer object
```

## Workflow Integration

### Interview Workflow:
1. Company views applicant
2. Clicks "นัดสัมภาษณ์" button
3. Modal opens with form
4. Company fills in details:
   - Interview type
   - Date & time
   - Location/video link
   - Interviewer info
   - Instructions
5. Clicks "ส่งนัดสัมภาษณ์"
6. API creates interview
7. Application status → INTERVIEW_SCHEDULED
8. Student receives notification
9. Student can confirm interview

### Offer Workflow:
1. Company views applicant (after interview)
2. Clicks "ส่ง Offer" button
3. Modal opens with form
4. Company fills in details:
   - Position title
   - Allowance amount
   - Start/end dates
   - Terms & conditions
   - Response deadline
5. Clicks "ส่งข้อเสนองาน"
6. API creates offer
7. Application status → OFFER_EXTENDED
8. Student receives notification
9. Student can accept/reject offer

## Student Side

### Interview Notification:
- Student sees interview details
- Can confirm attendance
- Can request reschedule
- Sees preparation notes

### Offer Notification:
- Student sees offer details
- Can accept or reject
- Must respond before deadline
- Can download offer letter

## Benefits

### For Companies:
- ✅ Easy to schedule interviews
- ✅ All details in one place
- ✅ Professional appearance
- ✅ Reduces back-and-forth communication

### For Students:
- ✅ Clear interview details
- ✅ Know what to prepare
- ✅ Clear offer terms
- ✅ Easy to respond

### For System:
- ✅ Structured data
- ✅ Automated notifications
- ✅ Audit trail
- ✅ Better analytics

## Future Enhancements

### Possible Additions:
1. **Calendar Integration**
   - Google Calendar sync
   - Outlook Calendar sync
   - iCal export

2. **Templates**
   - Save interview templates
   - Save offer templates
   - Quick fill

3. **Bulk Actions**
   - Schedule multiple interviews
   - Send multiple offers
   - Batch operations

4. **Reminders**
   - Auto-remind before interview
   - Auto-remind before deadline
   - Email/SMS notifications

5. **Video Integration**
   - Auto-create Zoom meetings
   - Auto-create Google Meet
   - Embedded video call

6. **Offer Comparison**
   - Students compare multiple offers
   - Side-by-side view
   - Decision matrix

## Testing Checklist

### Interview Modal:
- [ ] Opens correctly
- [ ] All fields render
- [ ] Type selection works
- [ ] Date validation works
- [ ] Location shows for in-person
- [ ] Video link shows for video
- [ ] Form submission works
- [ ] Success toast appears
- [ ] Modal closes after success
- [ ] Data saved to database

### Offer Modal:
- [ ] Opens correctly
- [ ] All fields render
- [ ] Currency formatting works
- [ ] Duration calculation works
- [ ] Date validation works
- [ ] Form submission works
- [ ] Success toast appears
- [ ] Modal closes after success
- [ ] Data saved to database

### Integration:
- [ ] Works in applicants page
- [ ] Works in recruitment page
- [ ] Application status updates
- [ ] Student receives notification
- [ ] Student can view details
- [ ] Student can respond

## Files Modified/Created

### New Files:
1. ✅ `frontend/components/ScheduleInterviewModal.js`
2. ✅ `frontend/components/SendOfferModal.js`
3. ✅ `INTERVIEW_OFFER_MODALS.md` (this file)

### Files to Update:
1. ⏳ `frontend/app/(app)/company/applicants/page.js` - Add modal triggers
2. ⏳ `frontend/app/(app)/recruitment/page.js` - Add modal triggers
3. ⏳ `frontend/app/(app)/student/interviews/page.js` - Show interview details
4. ⏳ `frontend/app/(app)/student/offers/page.js` - Show offer details

## Next Steps

1. **Integrate Modals**
   - Add to company/applicants page
   - Add to recruitment page
   - Add action buttons

2. **Test Functionality**
   - Test interview scheduling
   - Test offer sending
   - Test student notifications

3. **Student Views**
   - Create interview detail view
   - Create offer detail view
   - Add accept/reject buttons

4. **Notifications**
   - Email notifications
   - In-app notifications
   - SMS notifications (optional)

## Status

✅ Modals created
✅ UI/UX designed
✅ API integration ready
✅ Documentation complete
⏳ Integration pending
⏳ Testing pending
