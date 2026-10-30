import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';
import type { SocialSecurityFormData } from '../types/socialSecurityTypes';
import { formApi } from '../services/api';
import './SocialSecurityForm.css';

const SocialSecurityForm = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: '',
  });

  const [formData, setFormData] = useState<SocialSecurityFormData>({
    formNumber: 'ቅጽ ጡ -1',
    pensionIdNumber: '',
    employerOfficeIdNumber: '',
    workplaceInfo: {
      workplaceName: 'አምቦ ዩኒቨርሲቲ ወሊሶ ቢዝነስና ኢኮኖሚክስ ፋካልቲ',
      poBoxNumber: '217',
      phoneNumber: '011 342 31 28',
    },
    employeePersonalStatus: {
      fullNameWithSurname: '',
      gender: '',
      motherFullName: '',
      dateOfBirth: {
        day: '',
        month: '',
        year: '',
      },
      citizenshipObtainedBy: 'birth',
    },
    serviceHistory: [
      { serialNumber: 1, officeName: '', serviceStart: { day: '', month: '', year: '' }, serviceEnd: { day: '', month: '', year: '' }, monthlySalary: '', terminationReason: '' },
      { serialNumber: 2, officeName: '', serviceStart: { day: '', month: '', year: '' }, serviceEnd: { day: '', month: '', year: '' }, monthlySalary: '', terminationReason: '' },
    ],
    spouseInfo: {
      fullName: '',
      dateOfBirth: {
        day: '',
        month: '',
        year: '',
      },
    },
    children: [],
    fatherInfo: {
      fullName: '',
      meansOfLivelihood: '',
      yearOfBirth: '',
    },
    motherInfo: {
      fullName: '',
      meansOfLivelihood: '',
      yearOfBirth: '',
    },
    parentalSupport: {
      supportSituation: '',
      supportBy: 'salary',
    },
    employeeFullName: '',
    employeeSignature: false,
    submissionDate: '',
  });

  const addServiceHistory = () => {
    setFormData(prev => ({
      ...prev,
      serviceHistory: [
        ...prev.serviceHistory,
        {
          serialNumber: prev.serviceHistory.length + 1,
          officeName: '',
          serviceStart: { day: '', month: '', year: '' },
          serviceEnd: { day: '', month: '', year: '' },
          monthlySalary: '',
          terminationReason: '',
        },
      ],
    }));
  };

  const updateServiceHistory = (index: number, field: string, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      serviceHistory: prev.serviceHistory.map((service, i) =>
        i === index ? { ...service, [field]: value } : service
      ),
    }));
  };

  const addChild = () => {
    setFormData(prev => ({
      ...prev,
      children: [
        ...prev.children,
        {
          serialNumber: prev.children.length + 1,
          fullName: '',
          dateOfBirth: { day: '', month: '', year: '' },
          gender: '',
          motherFullName: '',
          isAdopted: false,
        },
      ],
    }));
  };

  const updateChild = (index: number, field: string, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      children: prev.children.map((child, i) =>
        i === index ? { ...child, [field]: value } : child
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.employeePersonalStatus.fullNameWithSurname || !formData.pensionIdNumber) {
      setSubmitStatus({
        type: 'error',
        message: 'Please fill in all required fields (Full Name and Pension ID Number)',
      });
      setTimeout(() => setSubmitStatus({ type: null, message: '' }), 5000);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      // Submit to backend API
      const response = await formApi.submitSocialSecurity(formData);

      if (response.success) {
        setSubmitStatus({
          type: 'success',
          message: response.message || 'Form submitted successfully! Your submission will be reviewed by admin.',
        });
      } else {
        throw new Error(response.message || 'Failed to submit form');
      }

      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          formNumber: 'ቅጽ ጡ -1',
          pensionIdNumber: '',
          employerOfficeIdNumber: '',
          workplaceInfo: {
            workplaceName: 'አምቦ ዩኒቨርሲቲ ወሊሶ ቢዝነስና ኢኮኖሚክስ ፋካልቲ',
            poBoxNumber: '217',
            phoneNumber: '011 342 31 28',
          },
          employeePersonalStatus: {
            fullNameWithSurname: '',
            gender: '',
            motherFullName: '',
            dateOfBirth: { day: '', month: '', year: '' },
            citizenshipObtainedBy: 'birth',
          },
          serviceHistory: [
            { serialNumber: 1, officeName: '', serviceStart: { day: '', month: '', year: '' }, serviceEnd: { day: '', month: '', year: '' }, monthlySalary: '', terminationReason: '' },
            { serialNumber: 2, officeName: '', serviceStart: { day: '', month: '', year: '' }, serviceEnd: { day: '', month: '', year: '' }, monthlySalary: '', terminationReason: '' },
          ],
          spouseInfo: {
            fullName: '',
            dateOfBirth: { day: '', month: '', year: '' },
          },
          children: [],
          fatherInfo: {
            fullName: '',
            meansOfLivelihood: '',
            yearOfBirth: '',
          },
          motherInfo: {
            fullName: '',
            meansOfLivelihood: '',
            yearOfBirth: '',
          },
          parentalSupport: {
            supportSituation: '',
            supportBy: 'salary',
          },
          employeeFullName: '',
          employeeSignature: false,
          submissionDate: '',
        });
        setSubmitStatus({ type: null, message: '' });
      }, 3000);
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus({
        type: 'error',
        message: 'An error occurred while submitting the form. Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus({ type: null, message: '' }), 5000);
    }
  };

  return (
    <div className="form-container">
      <div className="form-top-nav" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', background: '#ffffff', padding: '0.875rem 1.25rem', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', flexWrap: 'wrap', gap: '0.75rem' }}>
        <Link to="/" style={{ color: '#0f4c75', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem' }}>
          ← {t('nav.home', 'Portal Home')}
        </Link>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <Link to="/form" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 500, fontSize: '0.9rem' }}>
            📋 {t('nav.lifeHistoryForm', 'Life History Form')}
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/hr" style={{ color: '#0f4c75', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>
                📊 {t('nav.dashboard', 'HR Dashboard')}
              </Link>
              {user?.role === 'admin' && (
                <Link to="/admin" style={{ color: '#0f4c75', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>
                  ⚙️ {t('nav.admin', 'Admin Panel')}
                </Link>
              )}
            </>
          ) : (
            <Link to="/login" style={{ color: '#0f4c75', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>
              🔐 {t('nav.login', 'Staff Login')}
            </Link>
          )}
          <LanguageSwitcher />
          <ThemeToggle />
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

      <form onSubmit={handleSubmit} className="social-security-form">
        {/* Header */}
        <div className="form-header">
          <div className="header-top">
            <h1 className="form-number">{formData.formNumber}</h1>
            <div className="logo-section">
              <div className="emblem">⭐</div>
              <div className="agency-name">
                <p>በኢትዩጵያ ፌዴራላዊ ዲሞክራሲያዊ ሪፐብሊክ</p>
                <p>የማህበራዊ ዋስትና ኤጀንሲ</p>
              </div>
            </div>
            <div className="photo-box">
              <label>የሠራተኛ ፎቶ ግራፍ</label>
            </div>
          </div>

          <div className="header-fields">
            <div className="header-field">
              <label>የጡረታ መለያ ቁጥር</label>
              <input
                type="text"
                value={formData.pensionIdNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, pensionIdNumber: e.target.value }))}
                required
              />
            </div>
            <div className="header-field">
              <label>የአሠሪዉ መ/ቤት መለያ ቁጥር</label>
              <input
                type="text"
                value={formData.employerOfficeIdNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, employerOfficeIdNumber: e.target.value }))}
              />
            </div>
          </div>

          <h2 className="main-title">
            በጡረታ ዕቅድ የተሸፈኑ ሠራተኞች የግል፣ የአገልግሎትና የቤተሰብ ሁኔታ መግለጫ
          </h2>

          <div className="instructions">
            <p><strong>ማሳሰቢያ ፡-</strong></p>
            <p>
              ይህ ቅጽ ስርዝ ድልዝ የሌለበት፣ ባዶ ቦታ የሌለበት፣ በአንድ ቀለምና በአንድ እጅ ጽሑፍ መሞላት አለበት፡፡ 
              ቦታ ካልበቃ በተጨማሪ ወረቀት በመጠቀም የጥያቄዉ ቁጥርን በመጥቀስ መጨመር ይቻላል፡፡ 
              በዚህ ቅጽ ላይ የሚመዘገቡ ሁሉም ቀናት በኢትዮጵያ ዘመን አቆጣጠር መሆን አለበት፡፡
            </p>
          </div>
        </div>

        {/* Section 9.1 - Workplace Information */}
        <section className="form-section">
          <div className="section-header">
            <h3>9.1 የመስሪያ ቤቱ ስም</h3>
          </div>
          <div className="workplace-info">
            <div className="info-item">
              <label>የመስሪያ ቤቱ ስም</label>
              <input
                type="text"
                value={formData.workplaceInfo.workplaceName}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  workplaceInfo: { ...prev.workplaceInfo, workplaceName: e.target.value },
                }))}
              />
            </div>
            <div className="info-item">
              <label>ፖ.ሣ.ቁጥር</label>
              <input
                type="text"
                value={formData.workplaceInfo.poBoxNumber}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  workplaceInfo: { ...prev.workplaceInfo, poBoxNumber: e.target.value },
                }))}
              />
            </div>
            <div className="info-item">
              <label>ስልክ ቁጥር</label>
              <input
                type="text"
                value={formData.workplaceInfo.phoneNumber}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  workplaceInfo: { ...prev.workplaceInfo, phoneNumber: e.target.value },
                }))}
              />
            </div>
          </div>
        </section>

        {/* Section 9.2-9.4 - Employee Personal Status */}
        <section className="form-section">
          <div className="section-header">
            <h3>ሀ/ የሠራተኛዉ/ዋ/ የግል ሁኔታ</h3>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label>9.2 ስም ከነአያት</label>
              <input
                type="text"
                value={formData.employeePersonalStatus.fullNameWithSurname}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  employeePersonalStatus: { ...prev.employeePersonalStatus, fullNameWithSurname: e.target.value },
                }))}
                required
              />
            </div>
            <div className="form-group">
              <label>ጾታ</label>
              <input
                type="text"
                value={formData.employeePersonalStatus.gender}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  employeePersonalStatus: { ...prev.employeePersonalStatus, gender: e.target.value },
                }))}
              />
            </div>
            <div className="form-group">
              <label>የእናት ሙሉ ስም</label>
              <input
                type="text"
                value={formData.employeePersonalStatus.motherFullName}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  employeePersonalStatus: { ...prev.employeePersonalStatus, motherFullName: e.target.value },
                }))}
              />
            </div>
            <div className="form-group">
              <label>9.3 የልደት ዘመን</label>
              <div className="date-inputs">
                <input
                  type="text"
                  placeholder="ቀን"
                  value={formData.employeePersonalStatus.dateOfBirth.day}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    employeePersonalStatus: {
                      ...prev.employeePersonalStatus,
                      dateOfBirth: { ...prev.employeePersonalStatus.dateOfBirth, day: e.target.value },
                    },
                  }))}
                />
                <input
                  type="text"
                  placeholder="ወር"
                  value={formData.employeePersonalStatus.dateOfBirth.month}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    employeePersonalStatus: {
                      ...prev.employeePersonalStatus,
                      dateOfBirth: { ...prev.employeePersonalStatus.dateOfBirth, month: e.target.value },
                    },
                  }))}
                />
                <input
                  type="text"
                  placeholder="ዓ/ም"
                  value={formData.employeePersonalStatus.dateOfBirth.year}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    employeePersonalStatus: {
                      ...prev.employeePersonalStatus,
                      dateOfBirth: { ...prev.employeePersonalStatus.dateOfBirth, year: e.target.value },
                    },
                  }))}
                />
              </div>
            </div>
            <div className="form-group">
              <label>9.4 የኢትዮጰያ ዜግነት የተገኘበት ሁኔታ</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="citizenship"
                    value="birth"
                    checked={formData.employeePersonalStatus.citizenshipObtainedBy === 'birth'}
                    onChange={() => setFormData(prev => ({
                      ...prev,
                      employeePersonalStatus: { ...prev.employeePersonalStatus, citizenshipObtainedBy: 'birth' },
                    }))}
                  />
                  በትዉልድ
                </label>
                <label>
                  <input
                    type="radio"
                    name="citizenship"
                    value="legal_permit"
                    checked={formData.employeePersonalStatus.citizenshipObtainedBy === 'legal_permit'}
                    onChange={() => setFormData(prev => ({
                      ...prev,
                      employeePersonalStatus: { ...prev.employeePersonalStatus, citizenshipObtainedBy: 'legal_permit' },
                    }))}
                  />
                  በሕጋዊ ፈቃድ (ማስረጃ ተያይዞ መቅረብ አለበት)
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* Section 9.5 - Service History */}
        <section className="form-section">
          <div className="section-header">
            <h3>ለ. የአገልግሎት ሁኔታ</h3>
            <h4>9.5 አገልግሎት የተፈፀመባቸዉ መሥሪያ ቤቶች</h4>
          </div>
          <div className="service-history-table">
            <div className="table-header">
              <div>ተ.ቁ</div>
              <div>የመ/ቤቱ ስም</div>
              <div className="service-dates">
                <div>የአገልግሎት</div>
                <div className="sub-header">
                  <div>መነሻ</div>
                  <div>መድረሻ</div>
                </div>
              </div>
              <div className="date-columns">
                <div>ቀን</div>
                <div>ወር</div>
                <div>ዓ/ም</div>
                <div>ቀን</div>
                <div>ወር</div>
                <div>ዓ/ም</div>
              </div>
              <div>የወር ደመወዝ</div>
              <div>ሥራ የተቋረጠበት ምክንያት</div>
            </div>
            {formData.serviceHistory.map((service, index) => (
              <div key={index} className="table-row">
                <div className="serial-number">{service.serialNumber}</div>
                <input
                  type="text"
                  value={service.officeName}
                  onChange={(e) => updateServiceHistory(index, 'officeName', e.target.value)}
                />
                <div className="date-inputs-group">
                  <div className="date-inputs">
                    <input
                      type="text"
                      placeholder="ቀን"
                      value={service.serviceStart.day}
                      onChange={(e) => updateServiceHistory(index, 'serviceStart', { ...service.serviceStart, day: e.target.value })}
                    />
                    <input
                      type="text"
                      placeholder="ወር"
                      value={service.serviceStart.month}
                      onChange={(e) => updateServiceHistory(index, 'serviceStart', { ...service.serviceStart, month: e.target.value })}
                    />
                    <input
                      type="text"
                      placeholder="ዓ/ም"
                      value={service.serviceStart.year}
                      onChange={(e) => updateServiceHistory(index, 'serviceStart', { ...service.serviceStart, year: e.target.value })}
                    />
                  </div>
                  <div className="date-inputs">
                    <input
                      type="text"
                      placeholder="ቀን"
                      value={service.serviceEnd.day}
                      onChange={(e) => updateServiceHistory(index, 'serviceEnd', { ...service.serviceEnd, day: e.target.value })}
                    />
                    <input
                      type="text"
                      placeholder="ወር"
                      value={service.serviceEnd.month}
                      onChange={(e) => updateServiceHistory(index, 'serviceEnd', { ...service.serviceEnd, month: e.target.value })}
                    />
                    <input
                      type="text"
                      placeholder="ዓ/ም"
                      value={service.serviceEnd.year}
                      onChange={(e) => updateServiceHistory(index, 'serviceEnd', { ...service.serviceEnd, year: e.target.value })}
                    />
                  </div>
                </div>
                <input
                  type="text"
                  value={service.monthlySalary}
                  onChange={(e) => updateServiceHistory(index, 'monthlySalary', e.target.value)}
                />
                <input
                  type="text"
                  value={service.terminationReason}
                  onChange={(e) => updateServiceHistory(index, 'terminationReason', e.target.value)}
                />
              </div>
            ))}
            <button type="button" onClick={addServiceHistory} className="add-button">
              + አገልግሎት ልምድ ጨምር
            </button>
          </div>
          <div className="note-section">
            <p><strong>ማሳሰቢያ ፡-</strong> የቅጥር፣ የአገልግሎት ማስረጃ ቅድሚያ ያለዉ የሥራ መጠየቂያ እና የሕይወት ታሪክ ቅጽ ተያይዞ መቅረብ አለበት፡፡</p>
            <p>1.1 በቋሚነት ያልተፈፀመ አገልግሎት አይመዘገብም፡፡</p>
          </div>
        </section>

        {/* Section C - Family Status */}
        <section className="form-section">
          <div className="section-header">
            <h3>ሐ/ የቤተሰብ ሁኔታ</h3>
          </div>

          {/* Spouse Information */}
          <div className="spouse-section">
            <div className="spouse-header">
              <h4>፩፰፥ ሚስት ወይም ባል (የጋብቻዉ ማስረጃ ተያይዞ ይቅረብ)</h4>
              <div className="photo-box-small">
                <label>የሚስት/የባል ፎቶ ግራፍ</label>
              </div>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label>9.6 የሚስት/የባል ሙሉ ስም</label>
                <input
                  type="text"
                  value={formData.spouseInfo.fullName}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    spouseInfo: { ...prev.spouseInfo, fullName: e.target.value },
                  }))}
                />
              </div>
              <div className="form-group">
                <label>የልደት ዘመን፣ ቀን -ወር ዓ/ም</label>
                <div className="date-inputs">
                  <input
                    type="text"
                    placeholder="ቀን"
                    value={formData.spouseInfo.dateOfBirth.day}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      spouseInfo: {
                        ...prev.spouseInfo,
                        dateOfBirth: { ...prev.spouseInfo.dateOfBirth, day: e.target.value },
                      },
                    }))}
                  />
                  <input
                    type="text"
                    placeholder="ወር"
                    value={formData.spouseInfo.dateOfBirth.month}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      spouseInfo: {
                        ...prev.spouseInfo,
                        dateOfBirth: { ...prev.spouseInfo.dateOfBirth, month: e.target.value },
                      },
                    }))}
                  />
                  <input
                    type="text"
                    placeholder="ዓ/ም"
                    value={formData.spouseInfo.dateOfBirth.year}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      spouseInfo: {
                        ...prev.spouseInfo,
                        dateOfBirth: { ...prev.spouseInfo.dateOfBirth, year: e.target.value },
                      },
                    }))}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Children Table */}
          <div className="children-section">
            <h4>ዕድሜያቸዉ ከ18 ዓመት በታች የሆኑ ልጆች</h4>
            <div className="children-table">
              <div className="table-header">
                <div>ተ.ቁ</div>
                <div>ሙሉ ስም</div>
                <div>የልደት ቀን ወር ዓ/ም</div>
                <div>ጾታ</div>
                <div>የእናት ሙሉ ስም</div>
              </div>
              {formData.children.map((child, index) => (
                <div key={index} className="table-row">
                  <div className="serial-number">{child.serialNumber}</div>
                  <input
                    type="text"
                    value={child.fullName}
                    onChange={(e) => updateChild(index, 'fullName', e.target.value)}
                  />
                  <div className="date-inputs">
                    <input
                      type="text"
                      placeholder="ቀን"
                      value={child.dateOfBirth.day}
                      onChange={(e) => updateChild(index, 'dateOfBirth', { ...child.dateOfBirth, day: e.target.value })}
                    />
                    <input
                      type="text"
                      placeholder="ወር"
                      value={child.dateOfBirth.month}
                      onChange={(e) => updateChild(index, 'dateOfBirth', { ...child.dateOfBirth, month: e.target.value })}
                    />
                    <input
                      type="text"
                      placeholder="ዓ/ም"
                      value={child.dateOfBirth.year}
                      onChange={(e) => updateChild(index, 'dateOfBirth', { ...child.dateOfBirth, year: e.target.value })}
                    />
                  </div>
                  <input
                    type="text"
                    value={child.gender}
                    onChange={(e) => updateChild(index, 'gender', e.target.value)}
                  />
                  <input
                    type="text"
                    value={child.motherFullName}
                    onChange={(e) => updateChild(index, 'motherFullName', e.target.value)}
                  />
                  <div className="checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={child.isAdopted}
                        onChange={(e) => updateChild(index, 'isAdopted', e.target.checked)}
                      />
                      ጉዲፈቻ
                    </label>
                  </div>
                </div>
              ))}
              <button type="button" onClick={addChild} className="add-button">
                + ልጅ ጨምር
              </button>
            </div>
            <div className="note-section">
              <p><strong>ማሳሰቢያ ፡-</strong></p>
              <p>1. የልደት ምስክር ወረቀት ተያይዞ ይቅረብ *</p>
              <p>2. የጉዲፈቻ ልጅ ከሆነ/ች ማስረጃዉ ተያይዞ መቅረብ ይኖርበታል፡፡</p>
            </div>
          </div>

          {/* Living Parents */}
          <div className="parents-section">
            <h4>በሕይወት ያሉ ወላጆች</h4>
            <div className="form-grid">
              <div className="form-group">
                <label>9.8 የአባት ሙሉ ስም</label>
                <input
                  type="text"
                  value={formData.fatherInfo.fullName}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    fatherInfo: { ...prev.fatherInfo, fullName: e.target.value },
                  }))}
                />
              </div>
              <div className="form-group">
                <label>የመተዳደሪያ ሁኔታ</label>
                <input
                  type="text"
                  value={formData.fatherInfo.meansOfLivelihood}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    fatherInfo: { ...prev.fatherInfo, meansOfLivelihood: e.target.value },
                  }))}
                />
              </div>
              <div className="form-group">
                <label>የልደት ዘመን ዓ/ም</label>
                <input
                  type="text"
                  value={formData.fatherInfo.yearOfBirth}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    fatherInfo: { ...prev.fatherInfo, yearOfBirth: e.target.value },
                  }))}
                />
              </div>
              <div className="form-group">
                <label>9.9 የእናት ሙሉ ስም</label>
                <input
                  type="text"
                  value={formData.motherInfo.fullName}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    motherInfo: { ...prev.motherInfo, fullName: e.target.value },
                  }))}
                />
              </div>
              <div className="form-group">
                <label>የመተዳደሪያ ሁኔታ</label>
                <input
                  type="text"
                  value={formData.motherInfo.meansOfLivelihood}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    motherInfo: { ...prev.motherInfo, meansOfLivelihood: e.target.value },
                  }))}
                />
              </div>
              <div className="form-group">
                <label>የልደት ዘመን ዓ/ም</label>
                <input
                  type="text"
                  value={formData.motherInfo.yearOfBirth}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    motherInfo: { ...prev.motherInfo, yearOfBirth: e.target.value },
                  }))}
                />
              </div>
            </div>
            <div className="form-group">
              <label>10. ወላጆች የሚደገፉበት ሁኔታ ይገለጽ</label>
              <div className="support-inputs">
                <input
                  type="text"
                  value={formData.parentalSupport.supportSituation}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    parentalSupport: { ...prev.parentalSupport, supportSituation: e.target.value },
                  }))}
                />
                <select
                  value={formData.parentalSupport.supportBy}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    parentalSupport: { ...prev.parentalSupport, supportBy: e.target.value as 'salary' | 'other' },
                  }))}
                >
                  <option value="salary">በደመወዝ</option>
                  <option value="other">ሌላ</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Declaration and Signature */}
        <section className="form-section">
          <div className="declaration-section">
            <p className="declaration-text">
              ከዚህ በላይ የተገለፀዉ ትክክለኛ መሆኑን አረጋግጣለሁ፡፡
            </p>
            <div className="signature-fields">
              <div className="form-group">
                <label>የሠራተኛዉ/ዋ/ ሙሉ ስም</label>
                <input
                  type="text"
                  value={formData.employeeFullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, employeeFullName: e.target.value }))}
                  required
                />
              </div>
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    className="signature-checkbox"
                    checked={formData.employeeSignature}
                    onChange={(e) => setFormData(prev => ({ ...prev, employeeSignature: e.target.checked }))}
                  />
                  <span>ፊርማ</span>
                </label>
              </div>
              <div className="form-group">
                <label>ቀን</label>
                <input
                  type="date"
                  value={formData.submissionDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, submissionDate: e.target.value }))}
                />
              </div>
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

export default SocialSecurityForm;

