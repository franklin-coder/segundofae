

"use client"

import { motion } from 'framer-motion'
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { HelpCircle, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const FAQPage = () => {
  const faqs = [
    {
      question: "¿Todos sus productos son hechos a mano?",
      answer: "Sí, cada pieza de joyería de Faelight Crafts es cuidadosamente hecha a mano usando técnicas tradicionales de macramé. Cada producto es único y refleja la dedicación artesanal en cada detalle."
    },
    {
      question: "¿Aceptan pedidos personalizados?",
      answer: "¡Por supuesto! Nos encanta crear piezas personalizadas. Contáctanos con tus ideas, colores preferidos y cualquier requisito específico. Los pedidos personalizados suelen tomar 2-3 semanas para completarse."
    },
    {
      question: "¿Qué materiales utilizan en sus productos?",
      answer: "Utilizamos materiales de alta calidad como cordones de algodón, fibras naturales, cuentas de madera y herrajes de plata esterlina. Todos los materiales son cuidadosamente seleccionados por su durabilidad y atractivo estético."
    },
    {
      question: "¿Cómo debo cuidar mi joyería de macramé?",
      answer: "Para mantener tu joyería hermosa, evita mojarla y guárdala en un lugar seco. Para limpiarla, cepilla suavemente con un cepillo suave o paño. Evita químicos fuertes y luz solar directa por períodos prolongados."
    },
    {
      question: "¿Realizan envíos internacionales?",
      answer: "¡Sí! Enviamos a todo el mundo desde Victoria, Canadá. Los costos y tiempos de envío varían según la ubicación. Contáctanos para obtener tarifas específicas a tu país."
    },
    {
      question: "¿Cuánto tiempo toma el envío?",
      answer: "Los pedidos generalmente se envían dentro de 3-5 días hábiles. El envío dentro de Canadá toma 5-7 días hábiles, mientras que el envío internacional puede tomar 10-14 días hábiles."
    },
    {
      question: "¿Participan en mercados locales?",
      answer: "¡Sí! Participamos regularmente en mercados artesanales locales en Victoria. Síguenos en redes sociales o consulta aquí para conocer las próximas fechas y ubicaciones de mercados."
    },
    {
      question: "¿Cada pieza es realmente única?",
      answer: "Absolutamente. Aunque podemos crear piezas similares, cada producto de Faelight Crafts tiene sus propias características únicas debido a la naturaleza artesanal del proceso de creación. No encontrarás dos piezas exactamente iguales."
    }
  ]

  return (
    <div className="pt-16 lg:pt-20">
      <section className="py-20" style={{ backgroundColor: '#FAF5EF' }}>
        <div className="container max-w-4xl">
          {/* Header */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center mb-4">
              <HelpCircle className="h-8 w-8 text-[#0A8E81] mr-3" />
              <span className="text-lg font-medium text-[#0A8E81]">Support</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6" style={{ color: '#000000' }}>
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Have questions about FaeLight Crafts jewelry? Find answers to common 
              questions below, or feel free to contact me directly.
            </p>
          </motion.div>

          {/* FAQ Accordion */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="bg-white rounded-lg border border-gray-200 px-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <AccordionTrigger className="text-left font-semibold text-gray-900 hover:text-[#0A8E81] transition-colors">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 leading-relaxed pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>

          {/* Contact Section */}
          <motion.div 
            className="text-center mt-16 p-8 bg-white rounded-xl shadow-sm"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <MessageCircle className="h-12 w-12 text-[#0A8E81] mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-4" style={{ color: '#000000' }}>
              Still have questions?
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              I'm here to help! Don't hesitate to reach out if you need more information 
              or have specific questions about my jewelry.
            </p>
            <Link href="/contact">
              <Button 
                size="lg"
                className="bg-[#0A8E81] hover:bg-[#087267] text-white px-8 py-3 rounded-full text-lg font-medium transition-all duration-300 hover:scale-105"
              >
                Contact Me
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default FAQPage

