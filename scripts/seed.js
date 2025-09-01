const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = "mongodb+srv://mentorcodeai:RTDmJJixL1EIlu0l@cluster0.88ntzbp.mongodb.net/coment-ai-project";
const { Schema } = mongoose;

// --- Şema Tanımlamaları ---

const userSchema = new Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: false },
    role: { type: String, enum: ['super_admin', 'hr_manager', 'technical_interviewer', 'candidate'], default: 'candidate', required: true },
    company: { type: Schema.Types.ObjectId, ref: 'Company', required: false },
    image: { type: String, default: null },
    emailVerified: { type: Date, default: null }
}, { timestamps: true });

const companySchema = new Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    // Betik için sadeleştirilmiş alanlar
}, { timestamps: true });

const challengeSchema = new Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
    starterCode: { type: String, required: true },
    testCases: [{ input: Schema.Types.Mixed, expectedOutput: Schema.Types.Mixed }],
    company: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
}, { timestamps: true });


// --- Model Oluşturma ---
const User = mongoose.models.User || mongoose.model('User', userSchema);
const Company = mongoose.models.Company || mongoose.model('Company', companySchema);
const Challenge = mongoose.models.Challenge || mongoose.model('Challenge', challengeSchema);


const seedDatabase = async() => {
    if (!MONGODB_URI) {
        console.error('FATAL: MONGODB_URI is not defined.');
        process.exit(1);
    }

    try {
        await mongoose.connect(MONGODB_URI);
        console.log('MongoDB connected for seeding...');

        await User.deleteMany({});
        await Company.deleteMany({});
        await Challenge.deleteMany({});

        console.log('Creating company...');
        const company = await Company.create({
            name: 'Coment Inc.',
            email: 'contact@coment.ai',
        });

        console.log('Creating users...');
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash('123456', salt);

        const usersData = [
            { name: 'IK Yetkilisi', email: 'ik@coment.ai', password, role: 'hr_manager', company: company._id },
            { name: 'Teknik Mülakatçı', email: 'interviewer@coment.ai', password, role: 'technical_interviewer', company: company._id },
            { name: 'Aday Geliştirici', email: 'candidate@coment.ai', password, role: 'candidate', company: company._id },
            { name: 'Süper Admin', email: 'superadmin@coment.ai', password, role: 'super_admin' },
        ];

        await User.insertMany(usersData);
        console.log('Users created successfully.');
        console.log('------------------------------------');
        console.log('Test Login Credentials:');
        console.log('Email: ik@coment.ai');
        console.log('Password: 123456');
        console.log('------------------------------------');

        console.log('Creating sample challenge...');
        await Challenge.create({
            title: 'İki Sayının Toplamı',
            description: '<p>Verilen iki sayıyı toplayıp sonucu döndüren bir fonksiyon yazınız.</p>',
            difficulty: 'Easy',
            starterCode: 'function sum(a, b) {\n  // Kodunuzu buraya yazın\n}',
            testCases: [{ input: [1, 2], expectedOutput: 3 }],
            company: company._id,
        });
        console.log('Sample challenge created successfully.');

        console.log('\n✅ Database seeding completed successfully!');
    } catch (error) {
        console.error('❌ Error seeding database:', error);
    } finally {
        await mongoose.disconnect();
        console.log('MongoDB disconnected.');
    }
};

seedDatabase();