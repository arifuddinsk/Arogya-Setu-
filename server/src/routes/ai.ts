import { Router, Request, Response } from 'express';

export const aiRouter = Router();

aiRouter.post('/chat', (req: Request, res: Response) => {
  try {
    const { query, patientName = 'Patient' } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const lower = query.toLowerCase();
    let reply = '';
    let isUrgent = false;

    if (
      lower.includes('chest pain') ||
      lower.includes('heart attack') ||
      lower.includes('cannot breathe') ||
      lower.includes('unconscious')
    ) {
      isUrgent = true;
      reply = `🚨 **EMERGENCY MEDICAL ALERT**:
The symptoms you described require immediate emergency intervention!
1. **Dial 108 or 102 immediately** for an emergency ambulance.
2. Keep the patient in a comfortable seated position with open airflow.
3. Loosen tight clothing around the neck and chest.
4. Do not offer food or drink. Head to the nearest Primary Health Centre (PHC) without delay.`;
    } else if (lower.includes('how should i take my medicine') || lower.includes('take medicine')) {
      reply = `Based on standard rural healthcare clinical guidelines:
1. **Paracetamol (500mg/650mg)**: Take strictly **after meals** with a glass of warm water. Never take on an empty stomach.
2. **Antibiotics (Amoxicillin/Azithromycin)**: Space doses evenly (e.g. 12 hours apart) and always complete the full prescribed 5-day course.
3. **Antiallergics (Cetirizine)**: Take 1 tablet at night (bedtime), as it may cause slight drowsiness.
4. Drink plenty of boiled, filtered water and maintain oral rehydration with ORS.`;
    } else if (lower.includes('cough') || lower.includes('throat') || lower.includes('kadha')) {
      reply = `For seasonal cough and throat soreness in rural environments:
• **Warm Salt Water Gargle**: 1/2 tsp salt in warm water, gargle 3 times a day.
• **Ginger, Tulsi & Honey Decoction**: Fresh crushed ginger with boiled tulsi leaves and honey coats and soothes irritated throat tissue.
• **Steam Inhalation**: Inhale warm steam for 5–10 minutes to clear nasal and bronchial passages.
• *Note: If coughing lasts more than 2 weeks or produces rust-colored sputum, visit your PHC to test for pulmonary infections.*`;
    } else if (lower.includes('fever') || lower.includes('102') || lower.includes('temp')) {
      reply = `Fever care protocol:
• Take **Paracetamol 500mg** after food.
• Apply cool tap water compresses (cold sponging) on the forehead, neck, and armpits.
• Stay hydrated with boiled water, coconut water, or ORS.
• ⚠️ **Red Flag**: If body temperature crosses 102°F and remains high after 48 hours, or is accompanied by severe shivering or rash, visit your nearest tele-kiosk or PHC immediately for rapid malaria/dengue screening.`;
    } else if (lower.includes('empty stomach')) {
      reply = `It is strongly advised **NOT** to take Paracetamol, pain relievers, or antibiotics on an empty stomach. Taking them with or after a light meal (such as porridge, roti, or khichdi) prevents gastric acidity, nausea, and stomach mucosal irritation.`;
    } else {
      reply = `Thank you for reaching out, ${patientName}. For "${query}", adequate hydration, rest, and monitoring temperature or blood pressure are key initial steps. Would you like me to book a tele-consultation with Dr. Ramesh Sharma at your local village kiosk?`;
    }

    return res.json({
      success: true,
      assistantName: 'Aarogya Setu AI',
      reply,
      isUrgent,
      disclaimer:
        '⚠️ For informational purposes only. Consult a qualified healthcare professional for medical decisions.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});
