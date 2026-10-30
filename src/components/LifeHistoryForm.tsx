import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { LifeHistoryFormData, Gender, MaritalStatus, ProficiencyLevel } from '../types/formTypes';
import { submitFormToAdmin } from '../services/formSubmission';
import './LifeHistoryForm.css';

const LifeHistoryForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: '',
  });
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState<LifeHistoryFormData>({
    personalInfo: {
      employeeName: '',
      fatherName: '',
      paternalGrandfatherName: '',
      placeOfBirth: '',
      nationality: '',
      dateOfBirth: '',
      citizenship: 'ኢትዮጵያዊ',
      gender: 'male',
      region: '',
      h3: '',
      woreda: '',
      kebele: '',
      phoneNumber: '',
      houseNumber: '',
      profilePicture: null,
    },
    familyInfo: {
      maritalStatus: 'single',
      spouseName: '',
      children: [],
    },
    emergencyContact: {
      fullName: '',
      region: '',
      h7: '',
      woreda: '',
      kebele: '',
      phoneNumber: '',
      houseNumber: '',
    },
    guarantor: {
      fullName: '',
      region: '',
      h7: '',
      woreda: '',
      kebele: '',
      phone: '',
    },
    education: [
      { level: '፲ኛ ደረጃ ት/ቤት', schoolName: '', typeOfEducation: '', certificate: '' },
      { level: '2ኛ ደረጃ ት/ቤት', schoolName: '', typeOfEducation: '', certificate: '' },
      { level: 'ኮሌጅ', schoolName: '', typeOfEducation: '', certificate: '' },
      { level: 'ዩኒቨርሲቲ', schoolName: '', typeOfEducation: '', certificate: '' },
    ],
    languages: [
      { language: 'ኦሮምኛ', speaking: '', writing: '', reading: '', listening: '' },
      { language: 'እንግሊዘኛ', speaking: '', writing: '', reading: '', listening: '' },
      { language: 'አማርኛ', speaking: '', writing: '', reading: '', listening: '' },
      { language: 'ሌላ', speaking: '', writing: '', reading: '', listening: '' },
    ],
    specialSkills: [],
    drivingLicense: {
      hasLicense: false,
      from: '',
      to: '',
      idNumber: '',
    },
    workExperience: [],
    appreciation: {
      actDescription: '',
      commendationOrReward: '',
    },
    courtPenalties: [],
    administrativePenalties: [],
    confirmation: {
      employeeNameAndSignature: false,
      jobTitle: '',
      confirmingOfficialName: '',
      confirmingOfficialTitle: '',
      confirmingOfficialSignature: false,
    },
  });

  const updatePersonalInfo = (field: keyof typeof formData.personalInfo, value: string | Gender) => {
    setFormData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }));
  };

  const updateFamilyInfo = (field: keyof typeof formData.familyInfo, value: string | MaritalStatus | typeof formData.familyInfo.children) => {
    setFormData(prev => ({
      ...prev,
      familyInfo: { ...prev.familyInfo, [field]: value },
    }));
  };

  const addChild = () => {
    setFormData(prev => ({
      ...prev,
      familyInfo: {
        ...prev.familyInfo,
        children: [...prev.familyInfo.children, { sonName: '', daughterName: '' }],
      },
    }));
  };

  const updateChild = (index: number, field: keyof typeof formData.familyInfo.children[0], value: string) => {
    setFormData(prev => ({
      ...prev,
      familyInfo: {
        ...prev.familyInfo,
        children: prev.familyInfo.children.map((child, i) =>
          i === index ? { ...child, [field]: value } : child
        ),
      },
    }));
  };

  const updateEducation = (index: number, field: keyof typeof formData.education[0], value: string) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) =>
        i === index ? { ...edu, [field]: value } : edu
      ),
    }));
  };

  const updateLanguage = (index: number, field: 'speaking' | 'writing' | 'reading' | 'listening', value: ProficiencyLevel) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.map((lang, i) =>
        i === index ? { ...lang, [field]: value } : lang
      ),
    }));
  };

  const addSpecialSkill = () => {
    setFormData(prev => ({
      ...prev,
      specialSkills: [...prev.specialSkills, { skillType: '', timeSpent: '', certificate: '' }],
    }));
  };

  const updateSpecialSkill = (index: number, field: keyof typeof formData.specialSkills[0], value: string) => {
    setFormData(prev => ({
      ...prev,
      specialSkills: prev.specialSkills.map((skill, i) =>
        i === index ? { ...skill, [field]: value } : skill
      ),
    }));
  };

  const addWorkExperience = () => {
    setFormData(prev => ({
      ...prev,
      workExperience: [...prev.workExperience, {
        employerNameAndAddress: '',
        level: '',
        typeOfWork: '',
        levelAndSalary: '',
        reasonForTransferOrLeaving: '',
      }],
    }));
  };

  const updateWorkExperience = (index: number, field: keyof typeof formData.workExperience[0], value: string) => {
    setFormData(prev => ({
      ...prev,
      workExperience: prev.workExperience.map((exp, i) =>
        i === index ? { ...exp, [field]: value } : exp
      ),
    }));
  };

  const addCourtPenalty = () => {
    setFormData(prev => ({
      ...prev,
      courtPenalties: [...prev.courtPenalties, { penaltyType: '', reason: '', punishingAuthority: '' }],
    }));
  };

  const updateCourtPenalty = (index: number, field: keyof typeof formData.courtPenalties[0], value: string) => {
    setFormData(prev => ({
      ...prev,
      courtPenalties: prev.courtPenalties.map((penalty, i) =>
        i === index ? { ...penalty, [field]: value } : penalty
      ),
    }));
  };

  const addAdministrativePenalty = () => {
    setFormData(prev => ({
      ...prev,
      administrativePenalties: [...prev.administrativePenalties, { reason: '', from: '', to: '', decision: '' }],
    }));
  };

  const updateAdministrativePenalty = (index: number, field: keyof typeof formData.administrativePenalties[0], value: string) => {
    setFormData(prev => ({
      ...prev,
      administrativePenalties: prev.administrativePenalties.map((penalty, i) =>
        i === index ? { ...penalty, [field]: value } : penalty
      ),
    }));
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setSubmitStatus({
          type: 'error',
          message: 'Please upload an image file (JPG, PNG, etc.)',
        });
        setTimeout(() => setSubmitStatus({ type: null, message: '' }), 5000);
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setSubmitStatus({
          type: 'error',
          message: 'Image size should be less than 5MB',
        });
        setTimeout(() => setSubmitStatus({ type: null, message: '' }), 5000);
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Update form data
      setFormData(prev => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          profilePicture: file,
        },
      }));
    }
  };

  const handleRemoveProfilePicture = () => {
    setProfilePicturePreview(null);
    setFormData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        profilePicture: null,
      },
    }));
    // Reset file input
    const fileInput = document.getElementById('profile-picture-input') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.personalInfo.employeeName || !formData.personalInfo.fatherName) {
      setSubmitStatus({
        type: 'error',
        message: 'Please fill in all required fields (Employee Name and Father\'s Name)',
      });
      setTimeout(() => setSubmitStatus({ type: null, message: '' }), 5000);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const response = await submitFormToAdmin(formData);
      
      if (response.success) {
        setSubmitStatus({
          type: 'success',
          message: response.message,
        });
        
        // Reset form after successful submission
        setTimeout(() => {
          setFormData({
            personalInfo: {
              employeeName: '',
              fatherName: '',
              paternalGrandfatherName: '',
              placeOfBirth: '',
              nationality: '',
              dateOfBirth: '',
              citizenship: 'ኢትዮጵያዊ',
              gender: 'male',
              region: '',
              h3: '',
              woreda: '',
              kebele: '',
              phoneNumber: '',
              houseNumber: '',
              profilePicture: null,
            },
            familyInfo: {
              maritalStatus: 'single',
              spouseName: '',
              children: [],
            },
            emergencyContact: {
              fullName: '',
              region: '',
              h7: '',
              woreda: '',
              kebele: '',
              phoneNumber: '',
              houseNumber: '',
            },
            guarantor: {
              fullName: '',
              region: '',
              h7: '',
              woreda: '',
              kebele: '',
              phone: '',
            },
            education: [
              { level: '፲ኛ ደረጃ ት/ቤት', schoolName: '', typeOfEducation: '', certificate: '' },
              { level: '2ኛ ደረጃ ት/ቤት', schoolName: '', typeOfEducation: '', certificate: '' },
              { level: 'ኮሌጅ', schoolName: '', typeOfEducation: '', certificate: '' },
              { level: 'ዩኒቨርሲቲ', schoolName: '', typeOfEducation: '', certificate: '' },
            ],
            languages: [
              { language: 'ኦሮምኛ', speaking: '', writing: '', reading: '', listening: '' },
              { language: 'እንግሊዘኛ', speaking: '', writing: '', reading: '', listening: '' },
              { language: 'አማርኛ', speaking: '', writing: '', reading: '', listening: '' },
              { language: 'ሌላ', speaking: '', writing: '', reading: '', listening: '' },
            ],
            specialSkills: [],
            drivingLicense: {
              hasLicense: false,
              from: '',
              to: '',
              idNumber: '',
            },
            workExperience: [],
            appreciation: {
              actDescription: '',
              commendationOrReward: '',
            },
            courtPenalties: [],
            administrativePenalties: [],
            confirmation: {
              employeeNameAndSignature: false,
              jobTitle: '',
              confirmingOfficialName: '',
              confirmingOfficialTitle: '',
              confirmingOfficialSignature: false,
            },
          });
          setSubmitStatus({ type: null, message: '' });
        }, 3000);
      } else {
        setSubmitStatus({
          type: 'error',
          message: response.message,
        });
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus({
        type: 'error',
        message: 'An error occurred while submitting the form. Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
      // Clear status message after 5 seconds
      setTimeout(() => setSubmitStatus({ type: null, message: '' }), 5000);
    }
  };

  return (
    <div className="form-container">
      <div className="form-top-nav" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', background: '#ffffff', padding: '0.875rem 1.25rem', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <Link to="/" style={{ color: '#0f4c75', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem' }}>← Back to Portal Home</Link>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/hr" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 500, fontSize: '0.9rem' }}>📊 HR Dashboard</Link>
          <Link to="/social-security" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 500, fontSize: '0.9rem' }}>🛡️ Social Security Form</Link>
          <Link to="/admin" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 500, fontSize: '0.9rem' }}>⚙️ Admin Panel</Link>
        </div>
      </div>
      {submitStatus.type && (
        <div className={`notification ${submitStatus.type}`}>
          <div className="notification-content">
            <span className="notification-icon">
              {submitStatus.type === 'success' ? '✅' : '❌'}
            </span>
            <span className="notification-message">{submitStatus.message}</span>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="life-history-form">
        {/* Header */}
        <div className="form-header">
          <div className="header-content">
            <h1>Federal Government Employees</h1>
            <h2>Life History Form</h2>
            <div className="photo-box">
              {profilePicturePreview ? (
                <div className="photo-preview-container">
                  <img 
                    src={profilePicturePreview} 
                    alt="Profile" 
                    className="photo-preview"
                  />
                  <button
                    type="button"
                    className="remove-photo-btn"
                    onClick={handleRemoveProfilePicture}
                    title="Remove photo"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="photo-upload-area">
                  <label htmlFor="profile-picture-input" className="photo-upload-label">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    <span>ፎቶ ግራፍ</span>
                    <span className="photo-upload-hint">Click to upload</span>
                  </label>
                  <input
                    id="profile-picture-input"
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    style={{ display: 'none' }}
                  />
                </div>
              )}
            </div>
          </div>
          <p className="instruction">
            ማሳሰቢያ ፡- ይህ ቅጽ ግልጽና ስርዝ ድልዝ የሌለበት ሆኖ መሞላት አለበት፡፡
          </p>
          <p className="institution-name">
            የመስሪያ ቤት ስም: ወሊሶ ቢዝነስና ኢኮኖሚክስ ካምፓስ
          </p>
        </div>

        {/* Section 1: Personal Information */}
        <section className="form-section">
          <div className="section-header">
            <span className="section-number">1</span>
            <h3>የግል መረጃ</h3>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label>የሠራተኛ ስም</label>
              <input
                type="text"
                value={formData.personalInfo.employeeName}
                onChange={(e) => updatePersonalInfo('employeeName', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>የአባት ስም</label>
              <input
                type="text"
                value={formData.personalInfo.fatherName}
                onChange={(e) => updatePersonalInfo('fatherName', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>የወንድ አያት ስም</label>
              <input
                type="text"
                value={formData.personalInfo.paternalGrandfatherName}
                onChange={(e) => updatePersonalInfo('paternalGrandfatherName', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>የትዉልድ ቦታ</label>
              <input
                type="text"
                value={formData.personalInfo.placeOfBirth}
                onChange={(e) => updatePersonalInfo('placeOfBirth', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>ብሔር/ብሔረሰብ</label>
              <input
                type="text"
                value={formData.personalInfo.nationality}
                onChange={(e) => updatePersonalInfo('nationality', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>የትዉልድ ቀን፣ ወር፣ዓ/ም</label>
              <input
                type="date"
                value={formData.personalInfo.dateOfBirth}
                onChange={(e) => updatePersonalInfo('dateOfBirth', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>ዜግነት</label>
              <input
                type="text"
                value={formData.personalInfo.citizenship}
                readOnly
              />
            </div>
            <div className="form-group">
              <label>ጾታ</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.personalInfo.gender === 'male'}
                    onChange={(e) => updatePersonalInfo('gender', e.target.value as Gender)}
                  />
                  ወንድ
                </label>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={formData.personalInfo.gender === 'female'}
                    onChange={(e) => updatePersonalInfo('gender', e.target.value as Gender)}
                  />
                  ሴት
                </label>
              </div>
            </div>
            <div className="form-group">
              <label>ክልል</label>
              <input
                type="text"
                value={formData.personalInfo.region}
                onChange={(e) => updatePersonalInfo('region', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>H3</label>
              <input
                type="text"
                value={formData.personalInfo.h3}
                onChange={(e) => updatePersonalInfo('h3', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>ወረዳ</label>
              <input
                type="text"
                value={formData.personalInfo.woreda}
                onChange={(e) => updatePersonalInfo('woreda', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>ቀበሌ</label>
              <input
                type="text"
                value={formData.personalInfo.kebele}
                onChange={(e) => updatePersonalInfo('kebele', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>የስልከ ቁጥር</label>
              <input
                type="tel"
                value={formData.personalInfo.phoneNumber}
                onChange={(e) => updatePersonalInfo('phoneNumber', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>የቤት ቁጥር</label>
              <input
                type="text"
                value={formData.personalInfo.houseNumber}
                onChange={(e) => updatePersonalInfo('houseNumber', e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Section 3: Family Information */}
        <section className="form-section">
          <div className="section-header">
            <span className="section-number">3</span>
            <h3>የቤተሰብ መረጃ</h3>
          </div>
          <div className="form-group">
            <label>የጋብቻ ሁኔታ</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="maritalStatus"
                  value="married"
                  checked={formData.familyInfo.maritalStatus === 'married'}
                  onChange={(e) => updateFamilyInfo('maritalStatus', e.target.value as MaritalStatus)}
                />
                ያገባ
              </label>
              <label>
                <input
                  type="radio"
                  name="maritalStatus"
                  value="single"
                  checked={formData.familyInfo.maritalStatus === 'single'}
                  onChange={(e) => updateFamilyInfo('maritalStatus', e.target.value as MaritalStatus)}
                />
                ያላገባ
              </label>
              <label>
                <input
                  type="radio"
                  name="maritalStatus"
                  value="separated"
                  checked={formData.familyInfo.maritalStatus === 'separated'}
                  onChange={(e) => updateFamilyInfo('maritalStatus', e.target.value as MaritalStatus)}
                />
                የተለያየ
              </label>
              <label>
                <input
                  type="radio"
                  name="maritalStatus"
                  value="widowed"
                  checked={formData.familyInfo.maritalStatus === 'widowed'}
                  onChange={(e) => updateFamilyInfo('maritalStatus', e.target.value as MaritalStatus)}
                />
                በሞት የተለያዩ
              </label>
            </div>
          </div>
          <div className="form-group">
            <label>የሚስት/ የባል ስም</label>
            <input
              type="text"
              value={formData.familyInfo.spouseName}
              onChange={(e) => updateFamilyInfo('spouseName', e.target.value)}
            />
          </div>
          <div className="children-section">
            <div className="table-header">
              <div>የወንድ ልጅ ስም</div>
              <div>የተወለደበት ቀን፣ ወርና ዓ/ም</div>
              <div>የሴት ልጆች ስም</div>
              <div>የተወለድበት ቀን፣ ወርና ዓ/ም</div>
            </div>
            {formData.familyInfo.children.map((child, index) => (
              <div key={index} className="table-row">
                <input
                  type="text"
                  value={child.sonName || ''}
                  onChange={(e) => updateChild(index, 'sonName', e.target.value)}
                  placeholder="የወንድ ልጅ ስም"
                />
                <input
                  type="date"
                  value={child.sonDateOfBirth || ''}
                  onChange={(e) => updateChild(index, 'sonDateOfBirth', e.target.value)}
                />
                <input
                  type="text"
                  value={child.daughterName || ''}
                  onChange={(e) => updateChild(index, 'daughterName', e.target.value)}
                  placeholder="የሴት ልጅ ስም"
                />
                <input
                  type="date"
                  value={child.daughterDateOfBirth || ''}
                  onChange={(e) => updateChild(index, 'daughterDateOfBirth', e.target.value)}
                />
              </div>
            ))}
            <button type="button" onClick={addChild} className="add-button">
              + ልጅ ጨምር
            </button>
          </div>
        </section>

        {/* Section 4: Emergency Contact */}
        <section className="form-section">
          <div className="section-header">
            <span className="section-number">4</span>
            <h3>ለአደጋ ጊዜ ተጠሪ</h3>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label>ሙሉ ስም</label>
              <input
                type="text"
                value={formData.emergencyContact.fullName}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  emergencyContact: { ...prev.emergencyContact, fullName: e.target.value },
                }))}
              />
            </div>
            <div className="form-group">
              <label>ክልል</label>
              <input
                type="text"
                value={formData.emergencyContact.region}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  emergencyContact: { ...prev.emergencyContact, region: e.target.value },
                }))}
              />
            </div>
            <div className="form-group">
              <label>H7</label>
              <input
                type="text"
                value={formData.emergencyContact.h7}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  emergencyContact: { ...prev.emergencyContact, h7: e.target.value },
                }))}
              />
            </div>
            <div className="form-group">
              <label>ወረዳ</label>
              <input
                type="text"
                value={formData.emergencyContact.woreda}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  emergencyContact: { ...prev.emergencyContact, woreda: e.target.value },
                }))}
              />
            </div>
            <div className="form-group">
              <label>ቀበሌ</label>
              <input
                type="text"
                value={formData.emergencyContact.kebele}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  emergencyContact: { ...prev.emergencyContact, kebele: e.target.value },
                }))}
              />
            </div>
            <div className="form-group">
              <label>የስልከ ቁጥር</label>
              <input
                type="tel"
                value={formData.emergencyContact.phoneNumber}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  emergencyContact: { ...prev.emergencyContact, phoneNumber: e.target.value },
                }))}
              />
            </div>
            <div className="form-group">
              <label>የቤት</label>
              <input
                type="text"
                value={formData.emergencyContact.houseNumber}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  emergencyContact: { ...prev.emergencyContact, houseNumber: e.target.value },
                }))}
              />
            </div>
          </div>
        </section>

        {/* Section 5: Guarantor */}
        <section className="form-section">
          <div className="section-header">
            <span className="section-number">5</span>
            <h3>እንደአስፈላጊነቱ ተያዥ</h3>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label>ሙሉ ስም</label>
              <input
                type="text"
                value={formData.guarantor.fullName}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  guarantor: { ...prev.guarantor, fullName: e.target.value },
                }))}
              />
            </div>
            <div className="form-group">
              <label>ከልል</label>
              <input
                type="text"
                value={formData.guarantor.region}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  guarantor: { ...prev.guarantor, region: e.target.value },
                }))}
              />
            </div>
            <div className="form-group">
              <label>H7</label>
              <input
                type="text"
                value={formData.guarantor.h7}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  guarantor: { ...prev.guarantor, h7: e.target.value },
                }))}
              />
            </div>
            <div className="form-group">
              <label>ወረዳ</label>
              <input
                type="text"
                value={formData.guarantor.woreda}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  guarantor: { ...prev.guarantor, woreda: e.target.value },
                }))}
              />
            </div>
            <div className="form-group">
              <label>ቀበሌ</label>
              <input
                type="text"
                value={formData.guarantor.kebele}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  guarantor: { ...prev.guarantor, kebele: e.target.value },
                }))}
              />
            </div>
            <div className="form-group">
              <label>ስልክ</label>
              <input
                type="tel"
                value={formData.guarantor.phone}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  guarantor: { ...prev.guarantor, phone: e.target.value },
                }))}
              />
            </div>
          </div>
        </section>

        {/* Section 6: Education */}
        <section className="form-section">
          <div className="section-header">
            <span className="section-number">6</span>
            <h3>ትምህርት</h3>
          </div>
          <div className="education-table">
            <div className="table-header">
              <div>የትምህርት ደረጃ</div>
              <div>የትምህርት ቤት ስም</div>
              <div>የትምህርት ዓይነት</div>
              <div>የተሰጠ የምስከር ወረቀት/ዲፕሎማ/ዲግሪ</div>
            </div>
            {formData.education.map((edu, index) => (
              <div key={index} className="table-row">
                <input
                  type="text"
                  value={edu.level}
                  readOnly
                  className="readonly"
                />
                <input
                  type="text"
                  value={edu.schoolName}
                  onChange={(e) => updateEducation(index, 'schoolName', e.target.value)}
                />
                <input
                  type="text"
                  value={edu.typeOfEducation}
                  onChange={(e) => updateEducation(index, 'typeOfEducation', e.target.value)}
                />
                <input
                  type="text"
                  value={edu.certificate}
                  onChange={(e) => updateEducation(index, 'certificate', e.target.value)}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Section 7: Language */}
        <section className="form-section">
          <div className="section-header">
            <span className="section-number">7</span>
            <h3>ቋንቋ</h3>
          </div>
          <div className="language-table">
            <div className="table-header">
              <div>ቋንቋ</div>
              <div>መናገር</div>
              <div>መፃፍ</div>
              <div>ማንበብ</div>
              <div>መስማት</div>
            </div>
            {formData.languages.map((lang, index) => (
              <div key={index} className="table-row">
                <input
                  type="text"
                  value={lang.language}
                  readOnly
                  className="readonly"
                />
                <select
                  value={lang.speaking}
                  onChange={(e) => updateLanguage(index, 'speaking', e.target.value as ProficiencyLevel)}
                >
                  <option value="">--</option>
                  <option value="very_good">በጣም ጥሩ</option>
                  <option value="good">ጥሩ</option>
                </select>
                <select
                  value={lang.writing}
                  onChange={(e) => updateLanguage(index, 'writing', e.target.value as ProficiencyLevel)}
                >
                  <option value="">--</option>
                  <option value="very_good">በጣም ጥሩ</option>
                  <option value="good">ጥሩ</option>
                </select>
                <select
                  value={lang.reading}
                  onChange={(e) => updateLanguage(index, 'reading', e.target.value as ProficiencyLevel)}
                >
                  <option value="">--</option>
                  <option value="very_good">በጣም ጥሩ</option>
                  <option value="good">ጥሩ</option>
                </select>
                <select
                  value={lang.listening}
                  onChange={(e) => updateLanguage(index, 'listening', e.target.value as ProficiencyLevel)}
                >
                  <option value="">--</option>
                  <option value="very_good">በጣም ጥሩ</option>
                  <option value="good">ጥሩ</option>
                </select>
              </div>
            ))}
          </div>
        </section>

        {/* Section 8: Special Skill */}
        <section className="form-section">
          <div className="section-header">
            <span className="section-number">8</span>
            <h3>ልዩ ሙያ</h3>
          </div>
          <div className="special-skill-table">
            <div className="table-header">
              <div>የልዩ ሙያ ዓይነት</div>
              <div>የፈጀዉ ጊዜ</div>
              <div>የተሰጠ የሙያ ማስረጃ</div>
            </div>
            {formData.specialSkills.map((skill, index) => (
              <div key={index} className="table-row">
                <input
                  type="text"
                  value={skill.skillType}
                  onChange={(e) => updateSpecialSkill(index, 'skillType', e.target.value)}
                />
                <input
                  type="text"
                  value={skill.timeSpent}
                  onChange={(e) => updateSpecialSkill(index, 'timeSpent', e.target.value)}
                />
                <input
                  type="text"
                  value={skill.certificate}
                  onChange={(e) => updateSpecialSkill(index, 'certificate', e.target.value)}
                />
              </div>
            ))}
            <button type="button" onClick={addSpecialSkill} className="add-button">
              + ልዩ ሙያ ጨምር
            </button>
          </div>
          <div className="driving-license-section">
            <label>
              <input
                type="checkbox"
                checked={formData.drivingLicense.hasLicense}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  drivingLicense: { ...prev.drivingLicense, hasLicense: e.target.checked },
                }))}
              />
              የመኪና መንጃ ፈቃድ ካለ
            </label>
            {formData.drivingLicense.hasLicense && (
              <div className="form-grid">
                <div className="form-group">
                  <label>ከ-----አስከ-----</label>
                  <div className="date-range">
                    <input
                      type="date"
                      value={formData.drivingLicense.from}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        drivingLicense: { ...prev.drivingLicense, from: e.target.value },
                      }))}
                    />
                    <span>እስከ</span>
                    <input
                      type="date"
                      value={formData.drivingLicense.to}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        drivingLicense: { ...prev.drivingLicense, to: e.target.value },
                      }))}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>መለያ ቁጥር</label>
                  <input
                    type="text"
                    value={formData.drivingLicense.idNumber}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      drivingLicense: { ...prev.drivingLicense, idNumber: e.target.value },
                    }))}
                  />
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Section 9: Work Experience */}
        <section className="form-section">
          <div className="section-header">
            <span className="section-number">9</span>
            <h3>ቀድሞ የሥራ ልምድ</h3>
          </div>
          <div className="work-experience-table">
            <div className="table-header">
              <div>የቀጣሪዉ መስሪያ ቤት ስምና አድራሻ</div>
              <div>ደረጃ</div>
              <div>የሥራ ዓይነት</div>
              <div>ደረጃና ደመወዝ</div>
              <div>የተዘዋወረበት ወይም የለቀቀበት ምከንያት</div>
            </div>
            {formData.workExperience.map((exp, index) => (
              <div key={index} className="table-row">
                <input
                  type="text"
                  value={exp.employerNameAndAddress}
                  onChange={(e) => updateWorkExperience(index, 'employerNameAndAddress', e.target.value)}
                />
                <input
                  type="text"
                  value={exp.level}
                  onChange={(e) => updateWorkExperience(index, 'level', e.target.value)}
                />
                <input
                  type="text"
                  value={exp.typeOfWork}
                  onChange={(e) => updateWorkExperience(index, 'typeOfWork', e.target.value)}
                />
                <input
                  type="text"
                  value={exp.levelAndSalary}
                  onChange={(e) => updateWorkExperience(index, 'levelAndSalary', e.target.value)}
                />
                <input
                  type="text"
                  value={exp.reasonForTransferOrLeaving}
                  onChange={(e) => updateWorkExperience(index, 'reasonForTransferOrLeaving', e.target.value)}
                />
              </div>
            ))}
            <button type="button" onClick={addWorkExperience} className="add-button">
              + የሥራ ልምድ ጨምር
            </button>
          </div>
        </section>

        {/* Section 10: Appreciation */}
        <section className="form-section">
          <div className="section-header">
            <span className="section-number">10</span>
            <h3>ምስጋና</h3>
          </div>
          <p>ለምስጋና እና ለሽልማት ያበቃ ተግባር ቢኖር</p>
          <div className="form-group">
            <label>የተፈፀመበት ተግባር በአጭሩ</label>
            <textarea
              value={formData.appreciation.actDescription}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                appreciation: { ...prev.appreciation, actDescription: e.target.value },
              }))}
              rows={3}
            />
          </div>
          <div className="form-group">
            <label>የተሰጠዉ ምስጋና ወይም ሽልማት</label>
            <textarea
              value={formData.appreciation.commendationOrReward}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                appreciation: { ...prev.appreciation, commendationOrReward: e.target.value },
              }))}
              rows={3}
            />
          </div>
        </section>

        {/* Section 11: Court Penalty */}
        <section className="form-section">
          <div className="section-header">
            <span className="section-number">11</span>
            <h3>በፍርድ ቤት የተወሰነ ቅጣት ካለ ቢጠቀስ</h3>
          </div>
          <div className="penalty-table">
            <div className="table-header">
              <div>የቅጣቱ ዓይነት</div>
              <div>ምክንያት</div>
              <div>የቀጣዉ ባለስልጣን ወይም ፍርድ ቤት</div>
            </div>
            {formData.courtPenalties.map((penalty, index) => (
              <div key={index} className="table-row">
                <input
                  type="text"
                  value={penalty.penaltyType}
                  onChange={(e) => updateCourtPenalty(index, 'penaltyType', e.target.value)}
                />
                <input
                  type="text"
                  value={penalty.reason}
                  onChange={(e) => updateCourtPenalty(index, 'reason', e.target.value)}
                />
                <input
                  type="text"
                  value={penalty.punishingAuthority}
                  onChange={(e) => updateCourtPenalty(index, 'punishingAuthority', e.target.value)}
                />
              </div>
            ))}
            <button type="button" onClick={addCourtPenalty} className="add-button">
              + ቅጣት ጨምር
            </button>
          </div>
        </section>

        {/* Section 12: Administrative Penalty */}
        <section className="form-section">
          <div className="section-header">
            <span className="section-number">12</span>
            <h3>አስተዳደራዊ ቅጣት ካለ ቢጠቀስ</h3>
          </div>
          <div className="penalty-table">
            <div className="table-header">
              <div>የቅጣት ምከንያት</div>
              <div>ከ-----አስከ-----</div>
              <div>የተቀጣሪዉ መ/ቤት የተሰጠ ዉሳኔ</div>
            </div>
            {formData.administrativePenalties.map((penalty, index) => (
              <div key={index} className="table-row">
                <input
                  type="text"
                  value={penalty.reason}
                  onChange={(e) => updateAdministrativePenalty(index, 'reason', e.target.value)}
                />
                <div className="date-range">
                  <input
                    type="date"
                    value={penalty.from}
                    onChange={(e) => updateAdministrativePenalty(index, 'from', e.target.value)}
                  />
                  <span>እስከ</span>
                  <input
                    type="date"
                    value={penalty.to}
                    onChange={(e) => updateAdministrativePenalty(index, 'to', e.target.value)}
                  />
                </div>
                <input
                  type="text"
                  value={penalty.decision}
                  onChange={(e) => updateAdministrativePenalty(index, 'decision', e.target.value)}
                />
              </div>
            ))}
            <button type="button" onClick={addAdministrativePenalty} className="add-button">
              + ቅጣት ጨምር
            </button>
          </div>
        </section>

        {/* Section 13: Confirmation */}
        <section className="form-section">
          <div className="section-header">
            <span className="section-number">13</span>
            <h3>ማረጋገጫ</h3>
          </div>
          <p className="confirmation-statement">
            አኔ ስሜ ከዚህ በታች የተመለከተዉ ከዚህ በላይ የተገለፀዉ በሚሉ እዉነትና ትከከለኛ ስለመሆኑ የተረዳሁት መሆኑን በፊርማዬ አረጋግጣለሁ፡፡
          </p>
          <div className="form-grid">
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  className="signature-checkbox"
                  checked={formData.confirmation.employeeNameAndSignature}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    confirmation: { ...prev.confirmation, employeeNameAndSignature: e.target.checked },
                  }))}
                />
                <span>ስማና ፊርማ</span>
              </label>
            </div>
            <div className="form-group">
              <label>የሥራ መጠሪያ</label>
              <input
                type="text"
                value={formData.confirmation.jobTitle}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  confirmation: { ...prev.confirmation, jobTitle: e.target.value },
                }))}
              />
            </div>
            <div className="form-group">
              <label>የረጋገጠዉ ኃላፊ</label>
              <input
                type="text"
                value={formData.confirmation.confirmingOfficialName}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  confirmation: { ...prev.confirmation, confirmingOfficialName: e.target.value },
                }))}
              />
            </div>
            <div className="form-group">
              <label>ስምና ኃላፊነት</label>
              <input
                type="text"
                value={formData.confirmation.confirmingOfficialTitle}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  confirmation: { ...prev.confirmation, confirmingOfficialTitle: e.target.value },
                }))}
              />
            </div>
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  className="signature-checkbox"
                  checked={formData.confirmation.confirmingOfficialSignature}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    confirmation: { ...prev.confirmation, confirmingOfficialSignature: e.target.checked },
                  }))}
                />
                <span>ፊርማ</span>
              </label>
            </div>
          </div>
        </section>

        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner"></span>
                እየተላከ ነው...
              </>
            ) : (
              'ቅጹን አስገባ'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LifeHistoryForm;

