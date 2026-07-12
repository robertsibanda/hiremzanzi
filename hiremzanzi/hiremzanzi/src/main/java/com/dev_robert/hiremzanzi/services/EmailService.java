package com.dev_robert.hiremzanzi.services;

import com.dev_robert.hiremzanzi.models.Application;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.File;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    private static final String SITE_URL = "https://hiremzanzi.dev-robert.co.za";
    private static final String FROM_NOREPLY = "noreply@dev-robert.co.za";
    private static final String FROM_RECRUITERS = "recruiters@dev-robert.co.za";

    public void sendVerificationEmail(Application app) throws MessagingException, java.io.UnsupportedEncodingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(FROM_NOREPLY, "HireMzanzi");
        helper.setTo(app.getEmail());
        helper.setSubject("Verify your email - HireMzanzi Application");

        String verifyUrl = SITE_URL + "/api/applications/" + app.getId() + "/verify?token=" + app.getVerificationToken();

        String html = """
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: #10b981; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
                <h2 style="margin: 0;">HireMzanzi</h2>
                <p style="margin: 5px 0 0 0; opacity: 0.9;">Email Verification</p>
              </div>
              <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
                <p style="color: #374151; font-size: 16px;">Hi <strong>%s</strong>,</p>
                <p style="color: #374151; font-size: 14px;">Thank you for applying for <strong>%s</strong> at <strong>%s</strong>.</p>
                <p style="color: #374151; font-size: 14px;">Please click the button below to verify your email address:</p>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="%s" style="background: #10b981; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">Verify Email Address</a>
                </div>
                <p style="color: #9ca3af; font-size: 12px;">If the button doesn't work, copy and paste this link into your browser:</p>
                <p style="color: #6b7280; font-size: 12px; word-break: break-all;">%s</p>
              </div>
              <div style="text-align: center; padding: 15px; color: #9ca3af; font-size: 12px;">
                This is an automated email. Do not reply to this message.
              </div>
            </div>
            """.formatted(app.getFullName(), app.getVacancyTitle(), app.getCompanyName(), verifyUrl, verifyUrl);

        helper.setText(html, true);
        mailSender.send(message);
    }

    public void sendApplicationToCompany(Application app, String toEmail) throws MessagingException, java.io.UnsupportedEncodingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(FROM_RECRUITERS, "HireMzanzi Recruitment");
        helper.setTo(toEmail);
        helper.setSubject("Job Application - " + app.getVacancyTitle() + " - " + app.getFullName());

        String html = """
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: #2563eb; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
                <h2 style="margin: 0;">HireMzanzi</h2>
                <p style="margin: 5px 0 0 0; opacity: 0.9;">New Job Application</p>
              </div>
              <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
                <p style="color: #374151; font-size: 16px;">A new application has been received for the position of <strong>%s</strong>.</p>
                <table style="width: 100%%; border-collapse: collapse; margin: 20px 0;">
                  <tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #6b7280; width: 140px;">Applicant</td><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #374151; font-weight: bold;">%s</td></tr>
                  <tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Email</td><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #374151;">%s</td></tr>
                  <tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Phone</td><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #374151;">%s</td></tr>
                  <tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Position</td><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #374151;">%s</td></tr>
                  <tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Company</td><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #374151;">%s</td></tr>
                </table>
                <p style="color: #374151; font-size: 14px;"><strong>Cover Letter:</strong></p>
                <div style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb; color: #4b5563; font-size: 14px; white-space: pre-wrap;">%s</div>
                <p style="color: #9ca3af; font-size: 12px; margin-top: 20px;">Their CV is attached to this email.</p>
              </div>
              <div style="text-align: center; padding: 15px; color: #9ca3af; font-size: 12px;">
                Sent via HireMzanzi - hiremzanzi.dev-robert.co.za
              </div>
            </div>
            """.formatted(
                app.getVacancyTitle(),
                app.getFullName(),
                app.getEmail(),
                app.getPhone() != null ? app.getPhone() : "Not provided",
                app.getVacancyTitle(),
                app.getCompanyName(),
                app.getCoverLetter() != null ? app.getCoverLetter() : "No cover letter"
        );

        helper.setText(html, true);

        if (app.getCvPath() != null) {
            File cvFile = new File("/root/hiremzanzi/uploads/" + app.getCvPath());
            if (cvFile.exists()) {
                helper.addAttachment(app.getCvFileName(), cvFile);
            }
        }

        mailSender.send(message);
    }
}
