package org.example.utcctp.report;

import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfWriter;
import org.example.utcctp.model.Application;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;

@Service
public class PdfService {

    public byte[] generateInternshipLetter(Application application) {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document();
        PdfWriter.getInstance(document, out);

        document.open();
        
        // Fonts
        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
        Font subTitleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14);
        Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 12);

        // Header
        Paragraph title = new Paragraph("University of the Thai Chamber of Commerce", titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        document.add(title);

        Paragraph faculty = new Paragraph("Faculty of Extension Development", subTitleFont);
        faculty.setAlignment(Element.ALIGN_CENTER);
        document.add(faculty);

        document.add(Chunk.NEWLINE);

        // Date
        Paragraph date = new Paragraph("Date: " + java.time.LocalDate.now().toString(), normalFont);
        date.setAlignment(Element.ALIGN_RIGHT);
        document.add(date);

        document.add(Chunk.NEWLINE);

        // Recipient
        String companyName = application.getInternshipPosition() != null 
            ? application.getInternshipPosition().getCompany().getName() 
            : "Recipient Company";
        document.add(new Paragraph("To: Human Resources Manager", normalFont));
        document.add(new Paragraph(companyName, normalFont));
        
        document.add(Chunk.NEWLINE);

        // Subject
        Paragraph subject = new Paragraph("Subject: Request for Internship Placement", subTitleFont);
        document.add(subject);

        document.add(Chunk.NEWLINE);

        // Body
        String studentName = application.getStudent().getDisplayName();
        String major = application.getStudent().getMajor();
        String position = application.getInternshipPosition() != null ? application.getInternshipPosition().getTitle() : "Intern";
        
        Paragraph body = new Paragraph(
            "This letter is to formally request an internship placement for our student, " + studentName + 
            ", who is currently enrolled in " + major + " program. The student is interested in the '" + position + 
            "' position at your esteemed organization.",
            normalFont
        );
        body.setLeading(18);
        document.add(body);

        document.add(Chunk.NEWLINE);
        document.add(new Paragraph("The internship is a vital part of our academic curriculum, aimed at providing students with hands-on professional experience.", normalFont));

        document.add(Chunk.NEWLINE);
        document.add(Chunk.NEWLINE);

        // Signature
        Paragraph sign = new Paragraph("Sincerely yours,", normalFont);
        sign.setAlignment(Element.ALIGN_RIGHT);
        document.add(sign);
        
        document.add(Chunk.NEWLINE);

        Paragraph signName = new Paragraph("(Advisor / Department Head)", normalFont);
        signName.setAlignment(Element.ALIGN_RIGHT);
        document.add(signName);

        document.close();
        return out.toByteArray();
    }
}
