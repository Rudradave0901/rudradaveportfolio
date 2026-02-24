import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import useResume from '../hooks/useResume';
import { ButtonPrimary } from './Button';
import { isValidEmail } from '../utils/validationUtils';
import { GITHUB_ICON, LINKEDIN_ICON } from '../constants/icons';
import { UI_CONSTANTS } from '../constants/appConstants';

/**
 * Contact Component - Handles the contact form and displays social links.
 * 
 * Features:
 * - Dynamic social links from resumeData.
 * - Form validation (email).
 * - Feedback messages (success/error).
 * - Submits messages to the backend.
 */
const Contact = () => {
  const { resumeData } = useResume();

  // Initial social links state
  const [socialLinks, setSocialLinks] = useState([
    { href: '#', icon: GITHUB_ICON, alt: 'GitHub' },
    { href: '#', icon: LINKEDIN_ICON, alt: 'LinkedIn' }
  ]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [requestStatus, setRequestStatus] = useState({
    isLoading: false,
    isSuccess: false,
    errorMessage: null
  });

  // Synchronize social links with resume data once fetched
  useEffect(() => {
    if (resumeData?.contact) {
      const updatedLinks = [];
      const { github, linkedin } = resumeData.contact;

      if (github?.length > 0) {
        updatedLinks.push({
          href: github[0].url,
          icon: GITHUB_ICON,
          alt: 'GitHub'
        });
      }
      if (linkedin?.length > 0) {
        updatedLinks.push({
          href: linkedin[0].url,
          icon: LINKEDIN_ICON,
          alt: 'LinkedIn'
        });
      }

      if (updatedLinks.length > 0) {
        setSocialLinks(updatedLinks);
      }
    }
  }, [resumeData]);

  /**
   * Updates form state on input change.
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  /**
   * Validates and submits the contact form.
   */
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!isValidEmail(formData.email)) {
      setRequestStatus({
        isLoading: false,
        isSuccess: false,
        errorMessage: 'Please enter a valid email address.'
      });
      return;
    }

    setRequestStatus({ isLoading: true, isSuccess: false, errorMessage: null });

    try {
      const response = await axiosInstance.post("/messages", formData);

      if (response.data.success) {
        setRequestStatus({ isLoading: false, isSuccess: true, errorMessage: null });
        setFormData({ name: '', email: '', message: '' });

        // Auto-hide success message after timeout
        setTimeout(() => {
          setRequestStatus(prev => ({ ...prev, isSuccess: false }));
        }, UI_CONSTANTS.STATUS_MESSAGE_TIMEOUT);
      }
    } catch (err) {
      setRequestStatus({
        isLoading: false,
        isSuccess: false,
        errorMessage: err.response?.data?.message || 'Something went wrong. Please try again later.'
      });
    }
  };

  return (
    <section id="contact" className="section">
      <div className="container lg:grid-cols-2 lg:items-stretch">

        {/* Contact Information & Socials */}
        <div className="mb-12 lg:mb-0 lg:flex lg:flex-col">
          <h2 className="section-title mb-0 reveal-up">
            contact for <span>collaboration</span> :
          </h2>

          <p className="text-zinc-400 mt-3 mb-8 max-w-[50ch] lg:max-w-[40ch] reveal-up font-s-16">
            Reach out today to discuss your project needs and start collaborating on something amazing!
          </p>

          <div className="flex items-center gap-2 mt-auto mb-5">
            {socialLinks.map(({ href, icon, alt }, index) => (
              <a
                key={index}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={alt}
                className="w-12 h-12 grid place-items-center ring-inset ring-2 ring-zinc-50/5 rounded-lg transition-all hover:bg-zinc-700 hover:text-cyan-400"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleFormSubmit}>
          <div className="md:grid md:items-center md:grid-cols-2 md:gap-2">

            <div className="mb-4">
              <label htmlFor="name" className="label reveal-up">Name</label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                autoComplete="name"
                required
                placeholder="Write Full Name"
                className="text-field"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="label reveal-up">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleInputChange}
                autoComplete="email"
                required
                placeholder="Write Email Address"
                className="text-field"
              />
            </div>

          </div>

          <div className="mb-4">
            <label htmlFor="message" className="label reveal-up">Message</label>
            <textarea
              name="message"
              id="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="How can I help you?"
              className="text-field resize-y min-h-32 max-h-80"
              required
            ></textarea>
          </div>

          {/* Feedback Messages */}
          {requestStatus.errorMessage && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 text-red-500 rounded-lg text-sm animate-in fade-in slide-in-from-top-1">
              {requestStatus.errorMessage}
            </div>
          )}

          {requestStatus.isSuccess && (
            <div className="mb-4 p-3 bg-green-500/10 border border-green-500/50 text-green-500 rounded-lg text-sm animate-in fade-in slide-in-from-top-1">
              Message sent successfully! I'll get back to you soon.
            </div>
          )}

          <ButtonPrimary
            type="submit"
            label="Submit"
            isLoading={requestStatus.isLoading}
            classes="[!w-full] justify-center reveal-up"
          />

        </form>

      </div>
    </section>
  );
};

export default Contact;