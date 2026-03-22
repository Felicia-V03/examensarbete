import './index.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/** Bas-URL till backend API:et */
const API_BASE_URL = 'https://vcjts99zb3.execute-api.eu-north-1.amazonaws.com';

/** Profil-data för en inloggad användare */
interface Profile {
  userId: string;
  name: string;
  email: string;
  username: string;
  phoneNumber?: string;
  address?: string;
}

/**
 * ProfilePage – profilsida för inloggad användare.
 * Visar profilinformation och möjliggör redigering av e-post, telefonnummer och adress.
 * Omdirigerar till /login om ingen användare är inloggad.
 */
export const ProfilePage = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<Profile | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<Profile>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
  const userId = currentUser?.userId;

  const profile: Profile = profileData || {
    userId: currentUser?.userId || '',
    name: currentUser?.name || 'Användare',
    email: currentUser?.email || '',
    username: currentUser?.username || '',
    phoneNumber: currentUser?.phoneNumber,
    address: currentUser?.address,
  };

  useEffect(() => {
    if (!userId) {
      navigate('/login');
    }
  }, [userId, navigate]);

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
    if (!userId) return;

    setIsSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/profile/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: editFormData.email,
          phoneNumber: editFormData.phoneNumber,
          address: editFormData.address,
        }),
      });

      if (!response.ok) {
        throw new Error('Kunde inte uppdatera profil');
      }

      setProfileData(prev =>
        prev
          ? {
              ...prev,
              email: editFormData.email || prev.email,
              phoneNumber: editFormData.phoneNumber || prev.phoneNumber,
              address: editFormData.address || prev.address,
            }
          : null
      );

      const updatedUser = {
        ...currentUser,
        email: editFormData.email,
        phoneNumber: editFormData.phoneNumber,
        address: editFormData.address,
      };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));

      setProfileMessage({ text: 'Profil uppdaterad!', type: 'success' });
      setIsEditingProfile(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      setProfileMessage({ text: 'Kunde inte uppdatera profil. Försök igen.', type: 'error' });
    } finally {
      setIsSaving(false);
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
    window.location.reload();
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <section className="profile-header">
          <div className="profile-avatar">
            {profile.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="profile-info">
            <h1>{profile.name}</h1>
            <p className="profile-email">{profile.email}</p>
            {profile.phoneNumber && <p className="profile-phone">{profile.phoneNumber}</p>}
            {profile.address && <p className="profile-address">{profile.address}</p>}
          </div>
          <button className="edit-profile-btn" onClick={handleStartEditProfile}>
            Redigera profil
          </button>
          <button className="profile__logout-btn" onClick={handleLogout}>
            Logga ut
          </button>
        </section>

        {isEditingProfile && (
          <div className="modal-backdrop" onClick={handleCancelEditProfile}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <h2>Redigera profil</h2>
              {profileMessage && (
                <div className={`message message--${profileMessage.type}`}>
                  {profileMessage.text}
                </div>
              )}
              <form className="edit-profile-form">
                <div className="form-group">
                  <label htmlFor="edit-email">Email</label>
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
                  <label htmlFor="edit-phone">Telefonnummer</label>
                  <input
                    type="tel"
                    id="edit-phone"
                    name="phoneNumber"
                    value={editFormData.phoneNumber || ''}
                    onChange={handleEditProfileChange}
                    placeholder="Telefonnummer"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="edit-address">Adress</label>
                  <input
                    type="text"
                    id="edit-address"
                    name="address"
                    value={editFormData.address || ''}
                    onChange={handleEditProfileChange}
                    placeholder="Adress"
                  />
                </div>
                <div className="form-actions">
                  <button
                    type="button"
                    className="btn-save"
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                  >
                    {isSaving ? 'Sparar...' : 'Spara'}
                  </button>
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={handleCancelEditProfile}
                    disabled={isSaving}
                  >
                    Avbryt
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

