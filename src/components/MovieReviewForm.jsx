import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

// Esquema de validación estricta con Yup
const ReviewSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .required('El nombre es obligatorio'),
  email: Yup.string()
    .email('Ingresa un correo electrónico válido')
    .required('El correo electrónico es obligatorio'),
  rating: Yup.number()
    .min(1, 'Selecciona al menos 1 estrella')
    .max(5, 'Máximo 5 estrellas')
    .required('La puntuación es obligatoria'),
  comment: Yup.string()
    .min(10, 'El comentario debe tener al menos 10 caracteres')
    .required('El comentario es obligatorio'),
});

export default function MovieReviewForm({ movieId }) {
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      rating: 5,
      comment: '',
    },
    validationSchema: ReviewSchema,
    onSubmit: (values, { resetForm }) => {
      alert('¡Reseña publicada con éxito en tu sesión local!');
      console.log('Reseña guardada:', { movieId, ...values });
      resetForm();
    },
  });

  return (
    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl text-white max-w-lg mx-auto my-6 shadow-2xl">
      <h3 className="text-xl font-bold mb-4 text-red-600 flex items-center gap-2">
        🎬 Deja tu reseña
      </h3>

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {/* Campo Nombre */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Nombre</label>
          <input
            type="text"
            name="name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
            placeholder="Ej. Juan Pérez"
            className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-red-600 text-white"
          />
          {formik.touched.name && formik.errors.name && (
            <span className="text-red-500 text-xs mt-1 block">{formik.errors.name}</span>
          )}
        </div>

        {/* Campo Correo */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Correo Electrónico</label>
          <input
            type="email"
            name="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            placeholder="correo@ejemplo.com"
            className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-red-600 text-white"
          />
          {formik.touched.email && formik.errors.email && (
            <span className="text-red-500 text-xs mt-1 block">{formik.errors.email}</span>
          )}
        </div>

        {/* Campo Puntuación */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Puntuación</label>
          <select
            name="rating"
            onChange={formik.handleChange}
            value={formik.values.rating}
            className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-red-600 text-white"
          >
            <option value="5">⭐⭐⭐⭐⭐ Excelente (5)</option>
            <option value="4">⭐⭐⭐⭐ Muy Buena (4)</option>
            <option value="3">⭐⭐⭐ Buena (3)</option>
            <option value="2">⭐⭐ Regular (2)</option>
            <option value="1">⭐ Deficiente (1)</option>
          </select>
        </div>

        {/* Campo Comentario */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Comentario</label>
          <textarea
            name="comment"
            rows="3"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.comment}
            placeholder="¿Qué te pareció esta película clásica?"
            className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-red-600 text-white resize-none"
          />
          {formik.touched.comment && formik.errors.comment && (
            <span className="text-red-500 text-xs mt-1 block">{formik.errors.comment}</span>
          )}
        </div>

        {/* Botón enviar */}
        <button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-lg transition-colors shadow-lg"
        >
          Enviar Reseña
        </button>
      </form>
    </div>
  );
}