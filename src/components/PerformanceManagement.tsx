import { useState, useEffect } from 'react';
import type { PerformanceReview, Employee } from '../types/hrTypes';
import { hrApi } from '../services/api';
import './PerformanceManagement.css';

const PerformanceManagement = () => {
  const [reviews, setReviews] = useState<PerformanceReview[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<Partial<PerformanceReview>>({
    employeeId: '',
    reviewPeriod: '',
    reviewDate: new Date().toISOString().split('T')[0],
    overallRating: 0,
    goals: [''],
    achievements: [''],
    areasForImprovement: [''],
    reviewerName: '',
    comments: ''
  });

  useEffect(() => {
    fetchReviews();
    fetchEmployees();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await hrApi.getPerformanceReviews();
      if (response.success && response.data) {
        const reviewsList = Array.isArray(response.data) ? response.data : [];
        setReviews(reviewsList);
      }
    } catch (error) {
      console.error('Error fetching performance reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await hrApi.getEmployees();
      if (response.success && response.data) {
        const emps = Array.isArray(response.data) ? response.data : [];
        setEmployees(emps);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleAdd = () => {
    setFormData({
      employeeId: '',
      reviewPeriod: '',
      reviewDate: new Date().toISOString().split('T')[0],
      overallRating: 0,
      goals: [''],
      achievements: [''],
      areasForImprovement: [''],
      reviewerName: '',
      comments: ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this performance review?')) {
      // Note: Backend doesn't have delete endpoint, so we'll just remove from local state
      // In production, you'd call an API delete endpoint
      setReviews(reviews.filter(review => review.id !== id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const employee = employees.find(emp => emp.id === formData.employeeId);
      
      const reviewData = {
        ...formData,
        employeeName: employee ? `${employee.firstName} ${employee.lastName}` : '',
        goals: formData.goals?.filter(g => g.trim() !== '') || [],
        achievements: formData.achievements?.filter(a => a.trim() !== '') || [],
        areasForImprovement: formData.areasForImprovement?.filter(a => a.trim() !== '') || []
      };

      const response = await hrApi.createPerformanceReview(reviewData);
      if (response.success) {
        await fetchReviews();
        setShowModal(false);
      } else {
        alert(response.message || 'Failed to create performance review');
      }
    } catch (error) {
      console.error('Error creating performance review:', error);
      alert('Failed to create performance review');
    }
  };

  const addGoal = () => {
    setFormData({
      ...formData,
      goals: [...(formData.goals || []), '']
    });
  };

  const updateGoal = (index: number, value: string) => {
    const newGoals = [...(formData.goals || [])];
    newGoals[index] = value;
    setFormData({ ...formData, goals: newGoals });
  };

  const addAchievement = () => {
    setFormData({
      ...formData,
      achievements: [...(formData.achievements || []), '']
    });
  };

  const updateAchievement = (index: number, value: string) => {
    const newAchievements = [...(formData.achievements || [])];
    newAchievements[index] = value;
    setFormData({ ...formData, achievements: newAchievements });
  };

  const addImprovement = () => {
    setFormData({
      ...formData,
      areasForImprovement: [...(formData.areasForImprovement || []), '']
    });
  };

  const updateImprovement = (index: number, value: string) => {
    const newImprovements = [...(formData.areasForImprovement || [])];
    newImprovements[index] = value;
    setFormData({ ...formData, areasForImprovement: newImprovements });
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return '#10b981';
    if (rating >= 3) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="performance-management">
      <div className="page-header">
        <h2>Performance Reviews</h2>
        <button className="btn-primary" onClick={handleAdd}>
          + New Review
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading performance reviews...</div>
      ) : (
        <div className="reviews-grid">
          {reviews.map((review) => (
          <div key={review.id} className="review-card">
            <div className="review-header">
              <div>
                <h3>{review.employeeName}</h3>
                <p className="review-period">{review.reviewPeriod}</p>
              </div>
              <div className="rating-badge" style={{ backgroundColor: getRatingColor(review.overallRating) + '20', color: getRatingColor(review.overallRating) }}>
                {review.overallRating}/5
              </div>
            </div>
            <div className="review-details">
              <div className="review-section">
                <h4>Goals</h4>
                <ul>
                  {review.goals.map((goal, idx) => (
                    <li key={idx}>{goal}</li>
                  ))}
                </ul>
              </div>
              <div className="review-section">
                <h4>Achievements</h4>
                <ul>
                  {review.achievements.map((achievement, idx) => (
                    <li key={idx}>{achievement}</li>
                  ))}
                </ul>
              </div>
              <div className="review-section">
                <h4>Areas for Improvement</h4>
                <ul>
                  {review.areasForImprovement.map((area, idx) => (
                    <li key={idx}>{area}</li>
                  ))}
                </ul>
              </div>
              <div className="review-section">
                <h4>Reviewer Comments</h4>
                <p>{review.comments}</p>
              </div>
              <div className="review-footer">
                <span className="reviewer">Reviewed by: {review.reviewerName}</span>
                <span className="review-date">{new Date(review.reviewDate).toLocaleDateString()}</span>
              </div>
            </div>
            <button className="btn-delete" onClick={() => handleDelete(review.id)}>
              Delete
            </button>
          </div>
        ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content large-modal" onClick={(e) => e.stopPropagation()}>
            <h3>New Performance Review</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Employee</label>
                  <select
                    value={formData.employeeId}
                    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                    required
                  >
                  <option value="">Select Employee</option>
                  {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>
                        {emp.firstName} {emp.lastName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Review Period</label>
                  <input
                    type="text"
                    value={formData.reviewPeriod}
                    onChange={(e) => setFormData({ ...formData, reviewPeriod: e.target.value })}
                    placeholder="e.g., Q4 2023"
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Review Date</label>
                  <input
                    type="date"
                    value={formData.reviewDate}
                    onChange={(e) => setFormData({ ...formData, reviewDate: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Overall Rating (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    value={formData.overallRating}
                    onChange={(e) => setFormData({ ...formData, overallRating: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Reviewer Name</label>
                <input
                  type="text"
                  value={formData.reviewerName}
                  onChange={(e) => setFormData({ ...formData, reviewerName: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Goals</label>
                {formData.goals?.map((goal, idx) => (
                  <input
                    key={idx}
                    type="text"
                    value={goal}
                    onChange={(e) => updateGoal(idx, e.target.value)}
                    placeholder={`Goal ${idx + 1}`}
                    className="list-input"
                  />
                ))}
                <button type="button" className="btn-add-item" onClick={addGoal}>
                  + Add Goal
                </button>
              </div>
              <div className="form-group">
                <label>Achievements</label>
                {formData.achievements?.map((achievement, idx) => (
                  <input
                    key={idx}
                    type="text"
                    value={achievement}
                    onChange={(e) => updateAchievement(idx, e.target.value)}
                    placeholder={`Achievement ${idx + 1}`}
                    className="list-input"
                  />
                ))}
                <button type="button" className="btn-add-item" onClick={addAchievement}>
                  + Add Achievement
                </button>
              </div>
              <div className="form-group">
                <label>Areas for Improvement</label>
                {formData.areasForImprovement?.map((area, idx) => (
                  <input
                    key={idx}
                    type="text"
                    value={area}
                    onChange={(e) => updateImprovement(idx, e.target.value)}
                    placeholder={`Area ${idx + 1}`}
                    className="list-input"
                  />
                ))}
                <button type="button" className="btn-add-item" onClick={addImprovement}>
                  + Add Area
                </button>
              </div>
              <div className="form-group">
                <label>Comments</label>
                <textarea
                  value={formData.comments}
                  onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                  rows={4}
                  required
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceManagement;

