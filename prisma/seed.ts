import { PrismaClient, ExamType, Category } from '@prisma/client';

const prisma = new PrismaClient();

const colleges = [
  // Maharashtra Colleges
  { name: 'College of Engineering Pune', shortName: 'COEP', location: 'Pune', state: 'Maharashtra', type: 'Autonomous', ownership: 'Government', fees: 85000, rating: 4.3, placementScore: 85, nirfRank: 58, website: 'https://www.coep.org.in', establishedYear: 1854 },
  { name: 'Pune Institute of Computer Technology', shortName: 'PICT', location: 'Pune', state: 'Maharashtra', type: 'Autonomous', ownership: 'Government', fees: 90000, rating: 4.4, placementScore: 88, nirfRank: 75, website: 'https://pict.edu', establishedYear: 1983 },
  { name: 'Veermata Jijabai Technological Institute', shortName: 'VJTI', location: 'Mumbai', state: 'Maharashtra', type: 'Autonomous', ownership: 'Government', fees: 95000, rating: 4.5, placementScore: 90, nirfRank: 45, website: 'https://vjti.ac.in', establishedYear: 1887 },
  { name: 'Sardar Patel College of Engineering', shortName: 'SPCE', location: 'Mumbai', state: 'Maharashtra', type: 'Autonomous', ownership: 'Government', fees: 88000, rating: 4.2, placementScore: 82, nirfRank: 95, website: 'https://www.sp.edu.in', establishedYear: 1962 },
  { name: 'Walchand College of Engineering', shortName: 'WCE', location: 'Sangli', state: 'Maharashtra', type: 'Autonomous', ownership: 'Private', fees: 110000, rating: 4.1, placementScore: 78, nirfRank: 120, website: 'https://www.walchandsangli.ac.in', establishedYear: 1947 },
  { name: 'KJ Somaiya College of Engineering', shortName: 'KJSCE', location: 'Mumbai', state: 'Maharashtra', type: 'Autonomous', ownership: 'Private', fees: 180000, rating: 4.3, placementScore: 83, nirfRank: 88, website: 'https://kjsce.somaiya.edu', establishedYear: 1983 },
  { name: 'Government College of Engineering Karad', shortName: 'GCE Karad', location: 'Karad', state: 'Maharashtra', type: 'Autonomous', ownership: 'Government', fees: 75000, rating: 3.9, placementScore: 72, nirfRank: 180, website: 'https://www.gcekarad.ac.in', establishedYear: 1957 },
  { name: 'Ramrao Adik Institute of Technology', shortName: 'RAIT', location: 'Navi Mumbai', state: 'Maharashtra', type: 'Autonomous', ownership: 'Private', fees: 165000, rating: 4.0, placementScore: 75, nirfRank: 150, website: 'https://www.rait.ac.in', establishedYear: 1983 },
  { name: 'Vishwakarma Institute of Technology', shortName: 'VIT Pune', location: 'Pune', state: 'Maharashtra', type: 'Autonomous', ownership: 'Private', fees: 145000, rating: 4.2, placementScore: 80, nirfRank: 110, website: 'https://www.vit.edu', establishedYear: 1983 },
  { name: 'MIT World Peace University', shortName: 'MIT WPU', location: 'Pune', state: 'Maharashtra', type: 'Private University', ownership: 'Private', fees: 250000, rating: 4.1, placementScore: 76, nirfRank: 140, website: 'https://www.mitwpu.edu.in', establishedYear: 1983 },
  { name: 'Bharati Vidyapeeth College of Engineering', shortName: 'BVCOE', location: 'Pune', state: 'Maharashtra', type: 'Autonomous', ownership: 'Private', fees: 135000, rating: 4.0, placementScore: 74, nirfRank: 165, website: 'https://www.bvucoep.edu.in', establishedYear: 1983 },
  { name: 'Vishwakarma Institute of Information Technology', shortName: 'VIIT', location: 'Pune', state: 'Maharashtra', type: 'Autonomous', ownership: 'Private', fees: 150000, rating: 4.1, placementScore: 77, nirfRank: 145, website: 'https://www.viit.ac.in', establishedYear: 2002 },
  { name: 'Army Institute of Technology', shortName: 'AIT', location: 'Pune', state: 'Maharashtra', type: 'Autonomous', ownership: 'Private', fees: 130000, rating: 4.2, placementScore: 81, nirfRank: 125, website: 'https://www.aitpune.com', establishedYear: 1994 },
  { name: 'SGGS Institute of Engineering and Technology', shortName: 'SGGS Nanded', location: 'Nanded', state: 'Maharashtra', type: 'Autonomous', ownership: 'Government', fees: 78000, rating: 3.8, placementScore: 70, nirfRank: 190, website: 'https://www.sggs.ac.in', establishedYear: 1983 },
  { name: 'DY Patil College of Engineering', shortName: 'DYPCE', location: 'Pune', state: 'Maharashtra', type: 'Autonomous', ownership: 'Private', fees: 155000, rating: 3.9, placementScore: 73, nirfRank: 170, website: 'https://www.dypcoeakurdi.ac.in', establishedYear: 1984 },

  // IITs
  { name: 'Indian Institute of Technology Bombay', shortName: 'IIT Bombay', location: 'Mumbai', state: 'Maharashtra', type: 'Institute of National Importance', ownership: 'Government', fees: 220000, rating: 4.8, placementScore: 98, nirfRank: 3, website: 'https://www.iitb.ac.in', establishedYear: 1958 },
  { name: 'Indian Institute of Technology Delhi', shortName: 'IIT Delhi', location: 'New Delhi', state: 'Delhi', type: 'Institute of National Importance', ownership: 'Government', fees: 220000, rating: 4.8, placementScore: 97, nirfRank: 2, website: 'https://home.iitd.ac.in', establishedYear: 1961 },
  { name: 'Indian Institute of Technology Madras', shortName: 'IIT Madras', location: 'Chennai', state: 'Tamil Nadu', type: 'Institute of National Importance', ownership: 'Government', fees: 220000, rating: 4.9, placementScore: 99, nirfRank: 1, website: 'https://www.iitm.ac.in', establishedYear: 1959 },
  { name: 'Indian Institute of Technology Kanpur', shortName: 'IIT Kanpur', location: 'Kanpur', state: 'Uttar Pradesh', type: 'Institute of National Importance', ownership: 'Government', fees: 220000, rating: 4.7, placementScore: 96, nirfRank: 4, website: 'https://www.iitk.ac.in', establishedYear: 1959 },
  { name: 'Indian Institute of Technology Kharagpur', shortName: 'IIT Kharagpur', location: 'Kharagpur', state: 'West Bengal', type: 'Institute of National Importance', ownership: 'Government', fees: 220000, rating: 4.7, placementScore: 95, nirfRank: 5, website: 'https://www.iitkgp.ac.in', establishedYear: 1951 },
  { name: 'Indian Institute of Technology Roorkee', shortName: 'IIT Roorkee', location: 'Roorkee', state: 'Uttarakhand', type: 'Institute of National Importance', ownership: 'Government', fees: 220000, rating: 4.6, placementScore: 94, nirfRank: 7, website: 'https://www.iitr.ac.in', establishedYear: 1847 },
  { name: 'Indian Institute of Technology Guwahati', shortName: 'IIT Guwahati', location: 'Guwahati', state: 'Assam', type: 'Institute of National Importance', ownership: 'Government', fees: 220000, rating: 4.6, placementScore: 93, nirfRank: 8, website: 'https://www.iitg.ac.in', establishedYear: 1994 },
  { name: 'Indian Institute of Technology Hyderabad', shortName: 'IIT Hyderabad', location: 'Hyderabad', state: 'Telangana', type: 'Institute of National Importance', ownership: 'Government', fees: 220000, rating: 4.5, placementScore: 91, nirfRank: 9, website: 'https://www.iith.ac.in', establishedYear: 2008 },

  // NITs
  { name: 'National Institute of Technology Trichy', shortName: 'NIT Trichy', location: 'Tiruchirappalli', state: 'Tamil Nadu', type: 'Institute of National Importance', ownership: 'Government', fees: 150000, rating: 4.6, placementScore: 92, nirfRank: 10, website: 'https://www.nitt.edu', establishedYear: 1964 },
  { name: 'National Institute of Technology Karnataka', shortName: 'NIT Surathkal', location: 'Surathkal', state: 'Karnataka', type: 'Institute of National Importance', ownership: 'Government', fees: 150000, rating: 4.6, placementScore: 91, nirfRank: 13, website: 'https://www.nitk.ac.in', establishedYear: 1960 },
  { name: 'National Institute of Technology Warangal', shortName: 'NIT Warangal', location: 'Warangal', state: 'Telangana', type: 'Institute of National Importance', ownership: 'Government', fees: 150000, rating: 4.5, placementScore: 90, nirfRank: 19, website: 'https://www.nitw.ac.in', establishedYear: 1959 },
  { name: 'National Institute of Technology Calicut', shortName: 'NIT Calicut', location: 'Calicut', state: 'Kerala', type: 'Institute of National Importance', ownership: 'Government', fees: 150000, rating: 4.5, placementScore: 89, nirfRank: 23, website: 'https://www.nitc.ac.in', establishedYear: 1961 },
  { name: 'National Institute of Technology Rourkela', shortName: 'NIT Rourkela', location: 'Rourkela', state: 'Odisha', type: 'Institute of National Importance', ownership: 'Government', fees: 150000, rating: 4.4, placementScore: 88, nirfRank: 24, website: 'https://www.nitrkl.ac.in', establishedYear: 1961 },
  { name: 'National Institute of Technology Durgapur', shortName: 'NIT Durgapur', location: 'Durgapur', state: 'West Bengal', type: 'Institute of National Importance', ownership: 'Government', fees: 150000, rating: 4.3, placementScore: 85, nirfRank: 47, website: 'https://nitdgp.ac.in', establishedYear: 1960 },
  { name: 'National Institute of Technology Jaipur', shortName: 'MNIT Jaipur', location: 'Jaipur', state: 'Rajasthan', type: 'Institute of National Importance', ownership: 'Government', fees: 150000, rating: 4.3, placementScore: 84, nirfRank: 48, website: 'https://www.mnit.ac.in', establishedYear: 1963 },
  { name: 'National Institute of Technology Allahabad', shortName: 'NIT Allahabad', location: 'Prayagraj', state: 'Uttar Pradesh', type: 'Institute of National Importance', ownership: 'Government', fees: 150000, rating: 4.2, placementScore: 82, nirfRank: 65, website: 'https://www.mnnit.ac.in', establishedYear: 1961 },

  // IIITs
  { name: 'International Institute of Information Technology Hyderabad', shortName: 'IIIT Hyderabad', location: 'Hyderabad', state: 'Telangana', type: 'Deemed University', ownership: 'Private', fees: 450000, rating: 4.7, placementScore: 95, nirfRank: 15, website: 'https://www.iiit.ac.in', establishedYear: 1998 },
  { name: 'International Institute of Information Technology Bangalore', shortName: 'IIIT Bangalore', location: 'Bangalore', state: 'Karnataka', type: 'State University', ownership: 'Government', fees: 320000, rating: 4.5, placementScore: 90, nirfRank: 28, website: 'https://www.iiitb.ac.in', establishedYear: 1999 },
  { name: 'ABV-Indian Institute of Information Technology and Management Gwalior', shortName: 'IIITM Gwalior', location: 'Gwalior', state: 'Madhya Pradesh', type: 'Institute of National Importance', ownership: 'Government', fees: 180000, rating: 4.3, placementScore: 83, nirfRank: 82, website: 'https://www.iiitm.ac.in', establishedYear: 1997 },
  { name: 'Indian Institute of Information Technology Allahabad', shortName: 'IIIT Allahabad', location: 'Prayagraj', state: 'Uttar Pradesh', type: 'Institute of National Importance', ownership: 'Government', fees: 180000, rating: 4.2, placementScore: 81, nirfRank: 103, website: 'https://www.iiita.ac.in', establishedYear: 1999 },

  // Private Engineering Colleges
  { name: 'Birla Institute of Technology and Science Pilani', shortName: 'BITS Pilani', location: 'Pilani', state: 'Rajasthan', type: 'Deemed University', ownership: 'Private', fees: 480000, rating: 4.6, placementScore: 93, nirfRank: 25, website: 'https://www.bits-pilani.ac.in', establishedYear: 1964 },
  { name: 'Vellore Institute of Technology', shortName: 'VIT Vellore', location: 'Vellore', state: 'Tamil Nadu', type: 'Deemed University', ownership: 'Private', fees: 195000, rating: 4.3, placementScore: 82, nirfRank: 11, website: 'https://vit.ac.in', establishedYear: 1984 },
  { name: 'SRM Institute of Science and Technology', shortName: 'SRM Chennai', location: 'Chennai', state: 'Tamil Nadu', type: 'Deemed University', ownership: 'Private', fees: 250000, rating: 4.2, placementScore: 79, nirfRank: 18, website: 'https://www.srmist.edu.in', establishedYear: 1985 },
  { name: 'Manipal Institute of Technology', shortName: 'MIT Manipal', location: 'Manipal', state: 'Karnataka', type: 'Deemed University', ownership: 'Private', fees: 320000, rating: 4.3, placementScore: 81, nirfRank: 46, website: 'https://manipal.edu/mit.html', establishedYear: 1957 },
  { name: 'Thapar Institute of Engineering and Technology', shortName: 'Thapar', location: 'Patiala', state: 'Punjab', type: 'Deemed University', ownership: 'Private', fees: 310000, rating: 4.2, placementScore: 80, nirfRank: 29, website: 'https://www.thapar.edu', establishedYear: 1956 },
  { name: 'PSG College of Technology', shortName: 'PSG Tech', location: 'Coimbatore', state: 'Tamil Nadu', type: 'Autonomous', ownership: 'Private', fees: 95000, rating: 4.4, placementScore: 86, nirfRank: 52, website: 'https://www.psgtech.edu', establishedYear: 1951 },
  { name: 'SSN College of Engineering', shortName: 'SSN', location: 'Chennai', state: 'Tamil Nadu', type: 'Autonomous', ownership: 'Private', fees: 185000, rating: 4.1, placementScore: 78, nirfRank: 89, website: 'https://www.ssn.edu.in', establishedYear: 1996 },
  { name: 'Amrita Vishwa Vidyapeetham Coimbatore', shortName: 'Amrita', location: 'Coimbatore', state: 'Tamil Nadu', type: 'Deemed University', ownership: 'Private', fees: 270000, rating: 4.3, placementScore: 83, nirfRank: 14, website: 'https://www.amrita.edu', establishedYear: 2003 },
  { name: 'PES University', shortName: 'PESU', location: 'Bangalore', state: 'Karnataka', type: 'Private University', ownership: 'Private', fees: 350000, rating: 4.2, placementScore: 84, nirfRank: 86, website: 'https://pes.edu', establishedYear: 1988 },
  { name: 'BMS College of Engineering', shortName: 'BMSCE', location: 'Bangalore', state: 'Karnataka', type: 'Autonomous', ownership: 'Private', fees: 165000, rating: 4.1, placementScore: 79, nirfRank: 94, website: 'https://www.bmsce.ac.in', establishedYear: 1946 },
  { name: 'RV College of Engineering', shortName: 'RVCE', location: 'Bangalore', state: 'Karnataka', type: 'Autonomous', ownership: 'Private', fees: 175000, rating: 4.2, placementScore: 81, nirfRank: 78, website: 'https://www.rvce.edu.in', establishedYear: 1963 },
  { name: 'Dayananda Sagar College of Engineering', shortName: 'DSCE', location: 'Bangalore', state: 'Karnataka', type: 'Autonomous', ownership: 'Private', fees: 210000, rating: 4.0, placementScore: 75, nirfRank: 135, website: 'https://www.dsce.edu.in', establishedYear: 1979 },
  { name: 'MS Ramaiah Institute of Technology', shortName: 'MSRIT', location: 'Bangalore', state: 'Karnataka', type: 'Autonomous', ownership: 'Private', fees: 200000, rating: 4.1, placementScore: 78, nirfRank: 106, website: 'https://www.msrit.edu', establishedYear: 1962 },
  { name: 'Netaji Subhas University of Technology', shortName: 'NSUT', location: 'New Delhi', state: 'Delhi', type: 'State University', ownership: 'Government', fees: 180000, rating: 4.4, placementScore: 87, nirfRank: 54, website: 'https://www.nsut.ac.in', establishedYear: 1983 },
  { name: 'Delhi Technological University', shortName: 'DTU', location: 'New Delhi', state: 'Delhi', type: 'State University', ownership: 'Government', fees: 175000, rating: 4.5, placementScore: 89, nirfRank: 34, website: 'https://www.dtu.ac.in', establishedYear: 1941 },
  { name: 'Indraprastha Institute of Information Technology Delhi', shortName: 'IIIT Delhi', location: 'New Delhi', state: 'Delhi', type: 'State University', ownership: 'Government', fees: 290000, rating: 4.5, placementScore: 90, nirfRank: 37, website: 'https://www.iiitd.ac.in', establishedYear: 2008 },
  { name: 'Jadavpur University', shortName: 'JU', location: 'Kolkata', state: 'West Bengal', type: 'State University', ownership: 'Government', fees: 12000, rating: 4.4, placementScore: 84, nirfRank: 42, website: 'https://www.jadavpuruniversity.in', establishedYear: 1955 },
  { name: 'Anna University', shortName: 'AU', location: 'Chennai', state: 'Tamil Nadu', type: 'State University', ownership: 'Government', fees: 60000, rating: 4.3, placementScore: 80, nirfRank: 43, website: 'https://www.annauniv.edu', establishedYear: 1978 },
  { name: 'College of Engineering Guindy', shortName: 'CEG', location: 'Chennai', state: 'Tamil Nadu', type: 'Autonomous', ownership: 'Government', fees: 50000, rating: 4.4, placementScore: 85, nirfRank: 56, website: 'https://www.annauniv.edu/ceg/', establishedYear: 1794 },
  { name: 'Institute of Chemical Technology Mumbai', shortName: 'ICT Mumbai', location: 'Mumbai', state: 'Maharashtra', type: 'Deemed University', ownership: 'Government', fees: 150000, rating: 4.5, placementScore: 88, nirfRank: 33, website: 'https://www.ictmumbai.edu.in', establishedYear: 1933 },
  { name: 'Birla Institute of Technology Mesra', shortName: 'BIT Mesra', location: 'Ranchi', state: 'Jharkhand', type: 'Deemed University', ownership: 'Private', fees: 380000, rating: 4.1, placementScore: 76, nirfRank: 101, website: 'https://www.bitmesra.ac.in', establishedYear: 1955 },
  { name: 'SASTRA Deemed University', shortName: 'SASTRA', location: 'Thanjavur', state: 'Tamil Nadu', type: 'Deemed University', ownership: 'Private', fees: 175000, rating: 4.2, placementScore: 79, nirfRank: 66, website: 'https://www.sastra.edu', establishedYear: 1984 },
  { name: 'Kalinga Institute of Industrial Technology', shortName: 'KIIT', location: 'Bhubaneswar', state: 'Odisha', type: 'Deemed University', ownership: 'Private', fees: 285000, rating: 4.0, placementScore: 74, nirfRank: 104, website: 'https://kiit.ac.in', establishedYear: 1992 },
  { name: 'Jaypee Institute of Information Technology', shortName: 'JIIT Noida', location: 'Noida', state: 'Uttar Pradesh', type: 'Deemed University', ownership: 'Private', fees: 220000, rating: 4.1, placementScore: 77, nirfRank: 97, website: 'https://www.jiit.ac.in', establishedYear: 2001 },
  { name: 'SRM University Delhi-NCR', shortName: 'SRM Delhi', location: 'Sonipat', state: 'Haryana', type: 'Private University', ownership: 'Private', fees: 285000, rating: 3.9, placementScore: 72, nirfRank: 155, website: 'https://srmuniversity.ac.in', establishedYear: 2013 },
  { name: 'LNM Institute of Information Technology', shortName: 'LNMIIT', location: 'Jaipur', state: 'Rajasthan', type: 'Deemed University', ownership: 'Private', fees: 260000, rating: 4.1, placementScore: 78, nirfRank: 107, website: 'https://www.lnmiit.ac.in', establishedYear: 2003 },
  { name: 'Shiv Nadar University', shortName: 'SNU', location: 'Greater Noida', state: 'Uttar Pradesh', type: 'Private University', ownership: 'Private', fees: 350000, rating: 4.2, placementScore: 81, nirfRank: 76, website: 'https://snu.edu.in', establishedYear: 2011 },
  { name: 'Amity University Noida', shortName: 'Amity', location: 'Noida', state: 'Uttar Pradesh', type: 'Private University', ownership: 'Private', fees: 290000, rating: 3.9, placementScore: 71, nirfRank: 148, website: 'https://www.amity.edu', establishedYear: 2005 },
  { name: 'Chandigarh University', shortName: 'CU', location: 'Mohali', state: 'Punjab', type: 'Private University', ownership: 'Private', fees: 180000, rating: 3.8, placementScore: 69, nirfRank: 174, website: 'https://www.cuchd.in', establishedYear: 2012 },
  { name: 'Lovely Professional University', shortName: 'LPU', location: 'Phagwara', state: 'Punjab', type: 'Private University', ownership: 'Private', fees: 160000, rating: 3.7, placementScore: 66, nirfRank: 198, website: 'https://www.lpu.in', establishedYear: 2005 },
  { name: 'Chitkara University Punjab', shortName: 'Chitkara', location: 'Rajpura', state: 'Punjab', type: 'Private University', ownership: 'Private', fees: 210000, rating: 3.9, placementScore: 70, nirfRank: 162, website: 'https://www.chitkara.edu.in', establishedYear: 2010 },
  { name: 'Graphic Era Deemed University', shortName: 'GEU', location: 'Dehradun', state: 'Uttarakhand', type: 'Deemed University', ownership: 'Private', fees: 225000, rating: 3.8, placementScore: 68, nirfRank: 181, website: 'https://www.geu.ac.in', establishedYear: 1993 },
  { name: 'Bennett University', shortName: 'BU', location: 'Greater Noida', state: 'Uttar Pradesh', type: 'Private University', ownership: 'Private', fees: 315000, rating: 4.0, placementScore: 74, nirfRank: 138, website: 'https://www.bennett.edu.in', establishedYear: 2016 },
  { name: 'Symbiosis Institute of Technology', shortName: 'SIT Pune', location: 'Pune', state: 'Maharashtra', type: 'Private', ownership: 'Private', fees: 330000, rating: 4.0, placementScore: 76, nirfRank: 127, website: 'https://www.sitpune.edu.in', establishedYear: 2008 },
  { name: 'Nirma University', shortName: 'Nirma', location: 'Ahmedabad', state: 'Gujarat', type: 'Private University', ownership: 'Private', fees: 210000, rating: 4.2, placementScore: 80, nirfRank: 71, website: 'https://nirmauni.ac.in', establishedYear: 2003 },
  { name: 'Dhirubhai Ambani Institute of Information and Communication Technology', shortName: 'DA-IICT', location: 'Gandhinagar', state: 'Gujarat', type: 'Deemed University', ownership: 'Private', fees: 215000, rating: 4.3, placementScore: 82, nirfRank: 80, website: 'https://www.daiict.ac.in', establishedYear: 2001 },
  { name: 'Institute of Infrastructure Technology Research and Management', shortName: 'IITRAM', location: 'Ahmedabad', state: 'Gujarat', type: 'Autonomous', ownership: 'Government', fees: 140000, rating: 4.0, placementScore: 75, nirfRank: 143, website: 'https://www.iitram.ac.in', establishedYear: 2013 },
  { name: 'Sardar Vallabhbhai National Institute of Technology Surat', shortName: 'NIT Surat', location: 'Surat', state: 'Gujarat', type: 'Institute of National Importance', ownership: 'Government', fees: 150000, rating: 4.4, placementScore: 87, nirfRank: 26, website: 'https://www.svnit.ac.in', establishedYear: 1961 },
  { name: 'Visvesvaraya National Institute of Technology', shortName: 'VNIT Nagpur', location: 'Nagpur', state: 'Maharashtra', type: 'Institute of National Importance', ownership: 'Government', fees: 150000, rating: 4.4, placementScore: 86, nirfRank: 39, website: 'https://vnit.ac.in', establishedYear: 1960 },
  { name: 'Maulana Azad National Institute of Technology', shortName: 'MANIT Bhopal', location: 'Bhopal', state: 'Madhya Pradesh', type: 'Institute of National Importance', ownership: 'Government', fees: 150000, rating: 4.3, placementScore: 84, nirfRank: 51, website: 'https://www.manit.ac.in', establishedYear: 1960 },
  { name: 'Indian Institute of Engineering Science and Technology Shibpur', shortName: 'IIEST Shibpur', location: 'Howrah', state: 'West Bengal', type: 'Institute of National Importance', ownership: 'Government', fees: 130000, rating: 4.3, placementScore: 83, nirfRank: 55, website: 'https://www.iiests.ac.in', establishedYear: 1856 },
  { name: 'Thiagarajar College of Engineering', shortName: 'TCE', location: 'Madurai', state: 'Tamil Nadu', type: 'Autonomous', ownership: 'Private', fees: 80000, rating: 4.2, placementScore: 80, nirfRank: 91, website: 'https://www.tce.edu', establishedYear: 1957 },
  { name: 'Sri Sivasubramaniya Nadar College of Engineering', shortName: 'SSN', location: 'Chennai', state: 'Tamil Nadu', type: 'Autonomous', ownership: 'Private', fees: 185000, rating: 4.1, placementScore: 78, nirfRank: 89, website: 'https://www.ssn.edu.in', establishedYear: 1996 },
  { name: 'Koneru Lakshmaiah Education Foundation', shortName: 'KL University', location: 'Guntur', state: 'Andhra Pradesh', type: 'Deemed University', ownership: 'Private', fees: 195000, rating: 3.9, placementScore: 71, nirfRank: 160, website: 'https://www.kluniversity.in', establishedYear: 1980 },
  { name: 'CVR College of Engineering', shortName: 'CVR', location: 'Hyderabad', state: 'Telangana', type: 'Autonomous', ownership: 'Private', fees: 135000, rating: 3.9, placementScore: 72, nirfRank: 176, website: 'https://www.cvr.ac.in', establishedYear: 2001 },
  { name: 'Gokaraju Rangaraju Institute of Engineering and Technology', shortName: 'GRIET', location: 'Hyderabad', state: 'Telangana', type: 'Autonomous', ownership: 'Private', fees: 145000, rating: 3.8, placementScore: 70, nirfRank: 185, website: 'https://www.griet.ac.in', establishedYear: 1997 },
  { name: 'Vasavi College of Engineering', shortName: 'VCE', location: 'Hyderabad', state: 'Telangana', type: 'Autonomous', ownership: 'Private', fees: 125000, rating: 4.0, placementScore: 74, nirfRank: 153, website: 'https://www.vce.ac.in', establishedYear: 1981 },
  { name: 'CMR Institute of Technology', shortName: 'CMRIT', location: 'Bangalore', state: 'Karnataka', type: 'Autonomous', ownership: 'Private', fees: 195000, rating: 3.9, placementScore: 71, nirfRank: 167, website: 'https://www.cmrit.ac.in', establishedYear: 1991 },
  { name: 'BNM Institute of Technology', shortName: 'BNMIT', location: 'Bangalore', state: 'Karnataka', type: 'Autonomous', ownership: 'Private', fees: 180000, rating: 3.8, placementScore: 69, nirfRank: 179, website: 'https://www.bnmit.in', establishedYear: 2001 },
  { name: 'Ramaiah University of Applied Sciences', shortName: 'RUAS', location: 'Bangalore', state: 'Karnataka', type: 'Private University', ownership: 'Private', fees: 265000, rating: 4.0, placementScore: 73, nirfRank: 158, website: 'https://www.msruas.ac.in', establishedYear: 2013 },
];

const courses = [
  'Computer Engineering',
  'Information Technology',
  'Artificial Intelligence and Data Science',
  'Electronics and Telecommunication Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
];

const branches = [
  'Computer Science and Engineering',
  'Information Technology',
  'AI and Data Science',
  'Electronics and Communication',
  'Mechanical',
  'Civil',
];

function getRandomCutoff(examType: ExamType, category: Category, year: number): number {
  let baseScore = 0;
  
  if (examType === ExamType.MHT_CET) {
    // MHT-CET percentile ranges
    switch (category) {
      case Category.OPEN: baseScore = 95 + Math.random() * 4.5; break;
      case Category.OBC: baseScore = 85 + Math.random() * 8; break;
      case Category.EWS: baseScore = 88 + Math.random() * 7; break;
      case Category.SC: baseScore = 70 + Math.random() * 15; break;
      case Category.ST: baseScore = 65 + Math.random() * 15; break;
    }
  } else {
    // JEE Main percentile ranges
    switch (category) {
      case Category.OPEN: baseScore = 92 + Math.random() * 7.5; break;
      case Category.OBC: baseScore = 80 + Math.random() * 10; break;
      case Category.EWS: baseScore = 85 + Math.random() * 8; break;
      case Category.SC: baseScore = 65 + Math.random() * 18; break;
      case Category.ST: baseScore = 60 + Math.random() * 18; break;
    }
  }

  // Year adjustment
  const yearAdjustment = (year - 2023) * 0.5;
  return Math.round((baseScore + yearAdjustment) * 100) / 100;
}

async function main() {
  console.log('Seeding database...');

  // Clear existing data
  await prisma.cutoff.deleteMany();
  await prisma.course.deleteMany();
  await prisma.college.deleteMany();

  console.log('Creating colleges and courses...');
  
  const collegeCreatePromises = colleges.map(async (collegeData) => {
    const college = await prisma.college.create({
      data: collegeData,
    });

    const courseCreatePromises = courses.map(async (courseName) => {
      const seats = Math.floor(60 + Math.random() * 180);
      const duration = 4;

      const course = await prisma.course.create({
        data: {
          name: courseName,
          duration,
          seats,
          collegeId: college.id,
        },
      });

      const cutoffData = [];
      for (const year of [2023, 2024, 2025]) {
        for (const examType of [ExamType.MHT_CET, ExamType.JEE_MAIN]) {
          for (const category of [Category.OPEN, Category.OBC, Category.EWS, Category.SC, Category.ST]) {
            const branchName = branches[Math.floor(Math.random() * branches.length)];
            const cutoffScore = getRandomCutoff(examType, category, year);

            cutoffData.push({
              examType,
              category,
              branch: branchName,
              cutoffScore,
              year,
              courseId: course.id,
            });
          }
        }
      }

      await prisma.cutoff.createMany({ data: cutoffData });
    });

    await Promise.all(courseCreatePromises);
    console.log(`Completed ${college.shortName}`);
  });

  await Promise.all(collegeCreatePromises);

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
