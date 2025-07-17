Regla 1: Prima dominical aplica solo para empleados SIND y personal CONF con puestos específicos
•  ✅ Test para empleado SIND elegible
•  ✅ Test para empleado CONF con puesto específico (monitoristas play city)  
•  ✅ Test que falla para empleado no elegible (tipo ADMIN)

Regla 2: Fecha de prima dominical debe corresponder al domingo del período de nómina
•  ✅ Test que pasa para fecha de domingo correcta
•  ✅ Test que falla para fecha que no es domingo

Regla 3: Fecha de falta debe coincidir con rango del período y no ser festivo
•  ✅ Test que pasa para fecha válida (no festiva)
•  ✅ Test que falla para fecha festiva

Regla 4: Fecha de descanso trabajado debe corresponder a día festivo
•  ✅ Test que pasa cuando es día festivo
•  ✅ Test que falla cuando no es día festivo

Regla 5: Día devuelto debe corresponder a falta anterior
•  ✅ Test que requiere aprobación para períodos anteriores
•  ✅ Test que falla cuando no existe falta anterior

Regla 6: Validación de días de descanso semanal
•  ✅ Test que pasa para prima dominical con día de descanso lunes-sábado
•  ✅ Test que falla para prima dominical con día de descanso domingo
•  ✅ Test que pasa para descanso trabajado cuando no es día de descanso semanal
•  ✅ Test que falla para descanso trabajado en día de descanso semanal