import React, { useState, useEffect, useContext } from 'react';
import { useAuth } from '../../context/AuthContext';
import { validateEmail, validatePhone } from '../../utils/helpers';
import api from '../../utils/api';
import './Profile.css';

const Profile = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    registrationNumber: '',
    phone: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/auth/profile');
      setProfile(response.data.user);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!profile.name) {
      newErrors.name = 'Name is required';
    } else if (profile.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!profile.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(profile.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!profile.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(profile.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    try {
      await api.put('/auth/profile', profile);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    fetchProfile();
    setIsEditing(false);
    setErrors({});
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card profile-card">
            <div className="card-header">
              <h3 className="card-title mb-0">
                <i className="bi bi-person-circle me-2"></i>
                Profile Information
              </h3>
            </div>
            <div className="card-body">
              <div className="profile-info">
                <div className="mb-3">
                  <label className="form-label">
                    <i className="bi bi-person me-2"></i>
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                      name="name"
                      value={profile.name}
                      onChange={handleChange}
                      disabled={saving}
                    />
                  ) : (
                    <p className="form-control-plaintext">{profile.name}</p>
                  )}
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    <i className="bi bi-envelope me-2"></i>
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      name="email"
                      value={profile.email}
                      onChange={handleChange}
                      disabled={saving}
                    />
                  ) : (
                    <p className="form-control-plaintext">{profile.email}</p>
                  )}
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    <i className="bi bi-card-text me-2"></i>
                    Registration Number
                  </label>
                  <p className="form-control-plaintext">{profile.registrationNumber}</p>
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    <i className="bi bi-telephone me-2"></i>
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                      name="phone"
                      value={profile.phone}
                      onChange={handleChange}
                      disabled={saving}
                    />
                  ) : (
                    <p className="form-control-plaintext">{profile.phone}</p>
                  )}
                  {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    <i className="bi bi-shield-check me-2"></i>
                    Role
                  </label>
                  <p className="form-control-plaintext">
                    <span className={`badge bg-${user.role === 'admin' ? 'danger' : 'primary'}`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </p>
                </div>
              </div>

              <div className="profile-actions">
                {isEditing ? (
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-primary"
                      onClick={handleSave}
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Saving...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-circle me-2"></i>
                          Save Changes
                        </>
                      )}
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={handleCancel}
                      disabled={saving}
                    >
                      <i className="bi bi-x-circle me-2"></i>
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-primary"
                      onClick={() => setIsEditing(true)}
                    >
                      <i className="bi bi-pencil me-2"></i>
                      Edit Profile
                    </button>
                    <button
                      className="btn btn-outline-danger"
                      onClick={logout}
                    >
                      <i className="bi bi-box-arrow-right me-2"></i>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
