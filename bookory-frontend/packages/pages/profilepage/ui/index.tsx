import './index.css';
import LogoText from '../../../../src/assets/logo-text.png';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, updateProfile } from '@bookory-frontend/auth-api';
import type { Profile } from '@bookory-frontend/user';
import { Navbar } from '@bookory-frontend/navbar';
import { MdOutlineAlternateEmail } from "react-icons/md";
import { SlPhone } from "react-icons/sl";
import { SlHome } from "react-icons/sl";

/**
 * ProfilePage – profilsida för inloggad användare.
 * Visar profilinformation och möjliggör redigering av e-post, telefonnummer och address.
 * Omdirigerar till /login om ingen användare är inloggad.
 */
export const ProfilePage = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<Profile | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<Profile>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
  //const userId = currentUser?.userId;

  const profile: Profile = profileData || {
    userId: currentUser?.userId || '',
    name: currentUser?.name || 'Användare',
    email: currentUser?.email || '',
    username: currentUser?.username || '',
    phone: currentUser?.phone,
    address: currentUser?.address,
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }
    getProfile().then(setProfileData).catch(() => {});
  }, [navigate]);

  /** Öppnar redigeringsläget och förfyller formuläret med aktuell profil */
  const handleStartEditProfile = () => {
    setEditFormData(profile);
    setIsEditingProfile(true);
    setProfileMessage(null);
  };

  /** Uppdaterar formulärdata när ett fält ändras */
  const handleEditProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  /** Skickar uppdaterad profil till API:et och sparar lokalt i localStorage */
  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await updateProfile({
        email: editFormData.email,
        phone: editFormData.phone,
        address: editFormData.address,

      });

      const freshProfile = await getProfile();
      setProfileData(freshProfile);

      const updatedUser = {
        ...currentUser,
        email: freshProfile.email,
        phone: freshProfile.phone,
        address: freshProfile.address,
      };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));

      setSuccessBanner('Profil uppdaterad!');
      setTimeout(() => setSuccessBanner(null), 3000);
    } catch (error) {
      console.error('Failed to update profile:', error);
      setProfileMessage({ text: 'Kunde inte uppdatera profil. Försök igen.', type: 'error' });
    } finally {
      setIsSaving(false);
      setIsEditingProfile(false);
      setProfileData(freshProfile => ({ ...freshProfile, ...editFormData } as Profile));
    }
  };

  /** Avbryter redigering och återställer formuläret */
  const handleCancelEditProfile = () => {
    setIsEditingProfile(false);
    setEditFormData({});
    setProfileMessage(null);
  };

  /** Loggar ut användaren genom att rensa localStorage och ladda om sidan */
  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('user');
    window.location.href='/';
  };

  return (    
    <div className="profile-page">
        <figure className="logo">
            <img src={LogoText} alt="Bookory Image" className="logo-image" />
        </figure>
      <div className="profile-container">
        <section className="profile-header">
          {successBanner && (
            <div className="success-banner">{successBanner}</div>
          )}
          <div className="profile-avatar">
            <aside className="profile-avatar__letter">
            {profile.username?.charAt(0).toUpperCase() || 'U'}
            </aside>
          </div>
          <div className="profile-info">
            <h1 className='profile-name'>{profile.username}</h1>
            <p className="profile-email">Email: {profile.email}</p>
            {profile.phone && <p className="profile-phone">Phone number: {profile.phone}</p>}
            {profile.address && <p className="profile-address">Address: {profile.address}</p>}
          </div>
          
          <div className="profile-btn">
            <button className="edit-profile-btn" onClick={handleStartEditProfile}>
              Edit profile
            </button>

            <button className="profile__logout-btn" onClick={handleLogout}>
              Log out
            </button>
          </div>
          
        </section>

        {isEditingProfile && (
          <div className="modal-overlay" onClick={handleCancelEditProfile}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <h2>Update your profile</h2>
              {profileMessage && (
                <div className={`message message--${profileMessage.type}`}>
                  {profileMessage.text}
                </div>
              )}
              <form className="edit-profile-form">
                <div className="form-group">
                  <label htmlFor="edit-email">
                    <i className="edit-email_icon">
                        <MdOutlineAlternateEmail />
                        </i>
                        Email
                    </label>
                  <input
                    type="email"
                    id="edit-email"
                    name="email"
                    value={editFormData.email || ''}
                    onChange={handleEditProfileChange}
                    placeholder="Email"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="edit-phone">
                    <i className="edit-telephon_icon">
                        <SlPhone />
                        </i>
                        Phone number
                    </label>
                  <input
                    type="tel"
                    id="edit-phone"
                    name="phone"
                    value={editFormData.phone || ''}
                    onChange={handleEditProfileChange}
                    placeholder="Phone number"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="edit-address">
                    <i className="edit-address_icon">
                        <SlHome />
                        </i>
                        Address
                    </label>
                  <input
                    type="text"
                    id="edit-address"
                    name="address"
                    value={editFormData.address || ''}
                    onChange={handleEditProfileChange}
                    placeholder="address"
                  />
                </div>
                <div className="form-actions">
                  <button
                    type="button"
                    className="btn-save"
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                  >
                    {isSaving ? 'Save...' : 'Save'}
                  </button>
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={handleCancelEditProfile}
                    disabled={isSaving}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      <Navbar/>
    </div>
  );
};
