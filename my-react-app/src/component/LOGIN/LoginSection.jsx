import React, { useState } from 'react';
import users from '../users';
import styles from './LoginSection.module.css';

const LoginSection = ({ onLogin }) => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });

    const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password } = credentials;

    try {
        const response = await fetch('http://127.0.0.1:8000/api/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            throw new Error('Échec de l’authentification');
        }

        const data = await response.json();
        onLogin(data);
    } catch (error) {
        console.error("Erreur de connexion:", error);
        alert("Nom d'utilisateur ou mot de passe incorrect");
    }
};


    return (
        <div className={styles.loginSection}>
            <div className={styles.loginForm}>
                <h2 className={styles.formTitle}>
                    <i className="fas fa-user-lock"></i> Connexion Sécurisée
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label>
                            <i className="fas fa-user"></i> Nom d'utilisateur
                        </label>
                        <input
                            type="text"
                            value={credentials.username}
                            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>
                            <i className="fas fa-lock"></i> Mot de passe
                        </label>
                        <input
                            type="password"
                            value={credentials.password}
                            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                            required
                        />
                    </div>
                    <button type="submit" className={styles.btn}>
                        <i className="fas fa-sign-in-alt"></i> Se connecter
                    </button>
                </form>
                <div className={`${styles.formGroup} ${styles.info}`}>
                    <p><strong>Comptes de démonstration :</strong></p>
                    <p>admin/admin123 - geomaticien/geo123 - consultant/cons123</p>
                </div>
            </div>
        </div>
    );
};

export default LoginSection;