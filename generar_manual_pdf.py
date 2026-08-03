# -*- coding: utf-8 -*-
"""
Generador del Manual de Estándares de Codificación en PDF.
Diseño profesional estilo documentación oficial (blanco, índigo corporativo).

Autor: Jackson Darley Montoya Mercado - SENA Ficha 3118526
Proyecto: ejemplo01 (Sistema de Gestión Empresarial - Angular 22)
"""

import os
from datetime import datetime

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.lib import utils
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    PageTemplate,
    Paragraph,
    PageBreak,
    Spacer,
    Table,
    TableStyle,
    ListFlowable,
    ListItem,
)

# ---------------------------------------------------------------
# Constantes corporativas
# ---------------------------------------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DOCS_DIR = os.path.join(BASE_DIR, "docs")
OUTPUT_PDF = os.path.join(DOCS_DIR, "Manual_Estandares_Codificacion.pdf")

AUTOR = "Jackson Darley Montoya Mercado"
FICHA = "3118526"
PROYECTO = "ejemplo01"
TECNOLOGIAS = "Angular 22 / TypeScript / Angular Material / Tailwind CSS / RxJS"

# Paleta profesional (blanco + indigo corporativo del proyecto)
BLANCO = colors.white
INDIGO = colors.HexColor("#1a237e")
INDIGO_CLARO = colors.HexColor("#3949ab")
AZUL_SUAVE = colors.HexColor("#e8eaf6")
GRIS_TITULO = colors.HexColor("#212121")
GRIS_TEXTO = colors.HexColor("#424242")
GRIS_SEC = colors.HexColor("#616161")
GRIS_CLARO_BG = colors.HexColor("#f5f7fa")
GRIS_BORDE = colors.HexColor("#e0e0e0")
VERDE_OK = colors.HexColor("#2e7d32")
VERDE_BG = colors.HexColor("#e8f5e9")
ROJO_ERROR = colors.HexColor("#c62828")
ROJO_BG = colors.HexColor("#fce4ec")
AMARILLO_BG = colors.HexColor("#fff8e1")
AMARILLO_BORDE = colors.HexColor("#f9a825")

# ---------------------------------------------------------------
# Estilos
# ---------------------------------------------------------------
styles = getSampleStyleSheet()


def crear_estilo(nombre, **kwargs):
    base = kwargs.pop("parent", styles["BodyText"])
    return ParagraphStyle(nombre, parent=base, **kwargs)


titulo_portada = crear_estilo(
    "TituloPortada",
    parent=styles["Title"],
    fontName="Helvetica-Bold",
    fontSize=28,
    leading=34,
    textColor=INDIGO,
    alignment=TA_CENTER,
    spaceAfter=12,
)

subtitulo_portada = crear_estilo(
    "SubtituloPortada",
    parent=styles["BodyText"],
    fontName="Helvetica",
    fontSize=14,
    leading=20,
    textColor=GRIS_SEC,
    alignment=TA_CENTER,
    spaceAfter=6,
)

titulo_seccion = crear_estilo(
    "TituloSeccion",
    parent=styles["Heading1"],
    fontName="Helvetica-Bold",
    fontSize=17,
    leading=22,
    textColor=INDIGO,
    spaceBefore=16,
    spaceAfter=8,
    borderWidth=0,
)

subtitulo_seccion = crear_estilo(
    "SubtituloSeccion",
    parent=styles["Heading2"],
    fontName="Helvetica-Bold",
    fontSize=13,
    leading=18,
    textColor=GRIS_TITULO,
    spaceBefore=10,
    spaceAfter=6,
)

cuerpo = crear_estilo(
    "Cuerpo",
    parent=styles["BodyText"],
    fontName="Helvetica",
    fontSize=9.8,
    leading=14,
    textColor=GRIS_TEXTO,
    alignment=TA_JUSTIFY,
    spaceAfter=6,
)

cuerpo_bullet = crear_estilo(
    "CuerpoBullet",
    parent=cuerpo,
    fontSize=9.5,
    leading=13.5,
    leftIndent=12,
)

codigo_estilo = crear_estilo(
    "Codigo",
    parent=styles["BodyText"],
    fontName="Courier",
    fontSize=8.6,
    leading=11.5,
    textColor=colors.HexColor("#1a1a1a"),
    backColor=GRIS_CLARO_BG,
    borderColor=GRIS_BORDE,
    borderWidth=0.5,
    borderPadding=6,
    spaceAfter=8,
    alignment=TA_LEFT,
)

celda_enc = crear_estilo(
    "CeldaEnc",
    parent=cuerpo,
    fontName="Helvetica-Bold",
    fontSize=8.6,
    leading=11,
    textColor=BLANCO,
    alignment=TA_LEFT,
)

celda = crear_estilo(
    "Celda",
    parent=cuerpo,
    fontSize=8.6,
    leading=11,
    textColor=GRIS_TEXTO,
    alignment=TA_LEFT,
    spaceAfter=0,
)

celda_ok = crear_estilo(
    "CeldaOk",
    parent=celda,
    textColor=VERDE_OK,
    fontName="Helvetica-Bold",
)

celda_err = crear_estilo(
    "CeldaErr",
    parent=celda,
    textColor=ROJO_ERROR,
    fontName="Helvetica-Bold",
)

nota_estilo = crear_estilo(
    "Nota",
    parent=cuerpo,
    fontSize=9.2,
    leading=13,
    textColor=colors.HexColor("#5d4037"),
    backColor=AMARILLO_BG,
    borderColor=AMARILLO_BORDE,
    borderWidth=1,
    borderPadding=8,
    spaceAfter=10,
    alignment=TA_LEFT,
)


def bloque_nota(texto, titulo="Nota"):
    """Bloque informativo tipo nota."""
    return Paragraph(
        f"<b>{titulo}:</b> {texto}",
        nota_estilo,
    )


def bloque_codigo(codigo):
    """Bloque de codigo con fondo gris. Escapa caracteres HTML para reportlab."""
    import html as _html

    escapado = (
        _html.escape(codigo)
        .replace("\n", "<br/>")
        .replace(" ", "&nbsp;")
    )
    return Paragraph(escapado, codigo_estilo)


def tabla_generica(datos, anchos, estilo_extra=None):
    """Crea tabla limpia estilo documentacion oficial."""
    t = Table(datos, colWidths=anchos, repeatRows=1)
    estilos = [
        ("BACKGROUND", (0, 0), (-1, 0), INDIGO),
        ("GRID", (0, 0), (-1, -1), 0.5, GRIS_BORDE),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [BLANCO, GRIS_CLARO_BG]),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
    ]
    if estilo_extra:
        estilos.extend(estilo_extra)
    t.setStyle(TableStyle(estilos))
    return t


def portada(historia):
    """Portada del documento - fondo blanco minimalista."""
    historia.append(Spacer(1, 4.5 * cm))
    historia.append(Paragraph("Servicio Nacional de Aprendizaje", subtitulo_portada))
    historia.append(Paragraph("Tecnología en Desarrollo de Software", subtitulo_portada))
    historia.append(Spacer(1, 1.5 * cm))
    historia.append(Paragraph("Manual de Estándares de Codificación", titulo_portada))
    historia.append(Paragraph("del Proyecto", titulo_portada))
    historia.append(Spacer(1, 1 * cm))
    historia.append(Paragraph(PROYECTO, subtitulo_portada))
    historia.append(Spacer(1, 3 * cm))

    # Tabla de datos institucionales
    datos = [
        [Paragraph("<b>Proyecto</b>", celda), Paragraph("ejemplo01 — Sistema de Gestión Empresarial", celda)],
        [Paragraph("<b>Versión</b>", celda), Paragraph("2.0", celda)],
        [Paragraph("<b>Fecha</b>", celda), Paragraph(datetime.now().strftime("%d/%m/%Y"), celda)],
        [Paragraph("<b>Autor</b>", celda), Paragraph(AUTOR, celda)],
        [Paragraph("<b>Ficha SENA</b>", celda), Paragraph(FICHA, celda)],
        [Paragraph("<b>Tecnologías</b>", celda), Paragraph(TECNOLOGIAS, celda)],
    ]
    t = tabla_generica(datos, [4 * cm, 12 * cm])
    t.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, -1), GRIS_CLARO_BG)]))
    historia.append(t)
    historia.append(PageBreak())


def control_versiones(historia):
    """Sección: Control de versiones."""
    historia.append(Paragraph("Control de versiones", titulo_seccion))
    datos = [
        [Paragraph("Versión", celda_enc), Paragraph("Fecha", celda_enc), Paragraph("Autor", celda_enc), Paragraph("Descripción", celda_enc)],
        [Paragraph("1.0", celda), Paragraph("03/08/2026", celda), Paragraph(AUTOR, celda), Paragraph("Versión inicial del manual de estándares.", celda)],
        [Paragraph("2.0", celda), Paragraph("03/08/2026", celda), Paragraph(AUTOR, celda), Paragraph("Reescritura completa basada en auditoría del código real.", celda)],
    ]
    historia.append(tabla_generica(datos, [2 * cm, 2.5 * cm, 5 * cm, 7 * cm]))
    historia.append(PageBreak())


def indice(historia):
    """Tabla de contenido con numeración."""
    historia.append(Paragraph("Tabla de contenido", titulo_seccion))
    secciones = [
        "1. Introducción",
        "2. Objetivos",
        "3. Alcance",
        "4. Arquitectura del proyecto",
        "5. Organización del proyecto",
        "6. Convenciones de nomenclatura",
        "7. Estándares para componentes",
        "8. Estándares para servicios",
        "9. Estándares para modelos",
        "10. Estándares para guards",
        "11. Routing",
        "12. Formularios",
        "13. Buenas prácticas TypeScript",
        "14. Buenas prácticas Angular",
        "15. Buenas prácticas RxJS",
        "16. Angular Material",
        "17. Tailwind CSS",
        "18. Calidad del código",
        "19. Clean Code",
        "20. SOLID",
        "21. DRY",
        "22. KISS",
        "23. Seguridad",
        "24. Rendimiento",
        "25. Accesibilidad",
        "26. Git",
        "27. Convenciones de commits",
        "28. Estrategia de ramas",
        "29. Pull Requests",
        "30. Revisión de código",
        "31. Checklist antes de integrar cambios",
        "32. Glosario",
        "33. Referencias",
        "34. Conclusiones",
        "35. Recomendaciones futuras",
    ]
    filas = [[Paragraph(s, celda)] for s in secciones]
    t = Table(filas, colWidths=[13 * cm])
    t.setStyle(TableStyle([
        ("ROWBACKGROUNDS", (0, 0), (-1, -1), [BLANCO, GRIS_CLARO_BG]),
        ("LINEBEFORE", (0, 0), (0, -1), 2, INDIGO),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]))
    historia.append(t)
    historia.append(PageBreak())


def introduccion(historia):
    historia.append(Paragraph("1. Introducción", titulo_seccion))
    historia.append(Paragraph(
        "El presente documento establece los estándares de codificación oficiales del proyecto "
        f"<b>{PROYECTO}</b>, un sistema de gestión empresarial desarrollado con <b>Angular 22</b> sobre "
        "<b>TypeScript</b>. El manual ha sido elaborado a partir de una <b>auditoría completa del código "
        "fuente real</b>, de modo que cada norma documentada refleja las convenciones, patrones y decisiones "
        "técnicas que el proyecto ya utiliza o que debería adoptar para su evolución.", cuerpo))
    historia.append(Paragraph(
        "Este documento es de aplicación obligatoria para todo desarrollador que realice cambios en el "
        "repositorio y sirve como guía oficial de desarrollo, revisión de código e incorporación de nuevos "
        "miembros al equipo.", cuerpo))
    historia.append(PageBreak())


def objetivos(historia):
    historia.append(Paragraph("2. Objetivos", titulo_seccion))
    objetivos_list = [
        "Garantizar la uniformidad del código fuente en todo el repositorio.",
        "Reducir la curva de aprendizaje de nuevos desarrolladores.",
        "Facilitar las revisiones de código mediante criterios objetivos.",
        "Documentar las decisiones arquitectónicas actuales del proyecto.",
        "Establecer un marco de calidad basado en principios de ingeniería de software.",
        "Servir como referencia oficial para la evolución futura del sistema.",
    ]
    historia.append(ListFlowable(
        [ListItem(Paragraph(o, cuerpo_bullet)) for o in objetivos_list],
        bulletType="bullet",
        start="•",
    ))
    historia.append(PageBreak())


def alcance(historia):
    historia.append(Paragraph("3. Alcance", titulo_seccion))
    historia.append(Paragraph("El manual aplica a la totalidad del código fuente del proyecto:", cuerpo))
    items = [
        "Componentes (src/app/components/)",
        "Servicios (src/app/services/)",
        "Modelos (src/app/models/)",
        "Guardas (src/app/guards/)",
        "Rutas (src/app/app.routes.ts)",
        "Configuración de la aplicación (src/app/app.config.ts)",
        "Punto de entrada (src/main.ts)",
        "Estilos globales (src/styles.css)",
        "Configuración del proyecto (angular.json, tsconfig*.json, .prettierrc, .editorconfig, .postcssrc.json)",
    ]
    historia.append(ListFlowable(
        [ListItem(Paragraph(i, cuerpo_bullet)) for i in items], bulletType="bullet"))
    historia.append(Spacer(1, 0.4 * cm))
    historia.append(bloque_nota(
        "El proyecto es una aplicación 100 % frontend con datos simulados (mock). No utiliza backend, "
        "base de datos ni autenticación real. Cualquier referencia a estas tecnologías debe tratarse como "
        "recomendación futura, nunca como práctica existente."))
    historia.append(PageBreak())


def arquitectura(historia):
    historia.append(Paragraph("4. Arquitectura del proyecto", titulo_seccion))
    historia.append(Paragraph(
        "El proyecto utiliza la <b>arquitectura standalone</b> de Angular (sin NgModules), con bootstrap "
        "directo de la aplicación y carga perezosa (lazy loading) en todas las rutas.", cuerpo))

    historia.append(Paragraph("4.1 Flujo de autenticación", subtitulo_seccion))
    historia.append(bloque_codigo(
        "Flujo: LoginComponent -> AuthService -> localStorage -> Router\n"
        "  1. El usuario ingresa credenciales y presiona submit\n"
        "  2. AuthService.login() valida contra credenciales demo (admin / admin123)\n"
        "  3. Si son correctas: guarda auth_user + auth_token en localStorage\n"
        "  4. Navega a /dashboard\n"
        "  5. AuthGuard verifica isAuthenticated() antes de permitir rutas protegidas"
    ))

    historia.append(Paragraph("4.2 Decisiones de diseño", subtitulo_seccion))
    decisiones = [
        [Paragraph("Decisión", celda_enc), Paragraph("Justificación", celda_enc)],
        [Paragraph("Componentes standalone", celda), Paragraph("Elimina NgModules innecesarios; simplifica imports y el árbol de dependencias.", celda)],
        [Paragraph("Lazy loading con loadComponent", celda), Paragraph("Reduce el bundle inicial; solo se carga el código de la ruta visitada.", celda)],
        [Paragraph("Signals para estado reactivo", celda), Paragraph("API moderna de Angular; evita la complejidad de Zone.js para estado local.", celda)],
        [Paragraph("Inyección con inject()", celda), Paragraph("Patrón funcional recomendado por Angular para componentes y guardas.", celda)],
        [Paragraph("Servicios mock con Observable.of()", celda), Paragraph("Simula latencia de red y mantiene la interfaz lista para un futuro HttpClient.", celda)],
        [Paragraph("Barriles (barrel files)", celda), Paragraph("Centralizan exportaciones y simplifican rutas de importación.", celda)],
    ]
    historia.append(tabla_generica(decisiones, [5.5 * cm, 11 * cm]))
    historia.append(PageBreak())


def organizacion(historia):
    historia.append(Paragraph("5. Organización del proyecto", titulo_seccion))
    historia.append(bloque_codigo(
        "ejemplo01/\n"
        "|-- angular.json\n"
        "|-- package.json\n"
        "|-- tsconfig.json / tsconfig.app.json / tsconfig.spec.json\n"
        "|-- .prettierrc / .editorconfig / .postcssrc.json\n"
        "|-- docs/\n"
        "|   |-- Estandares_Codificacion.pdf\n"
        "|   `-- Manual_Estandares_Codificacion.md\n"
        "|-- public/\n"
        "|   `-- favicon.ico\n"
        "`-- src/\n"
        "    |-- index.html\n"
        "    |-- main.ts\n"
        "    |-- styles.css\n"
        "    `-- app/\n"
        "        |-- app.ts\n"
        "        |-- app.config.ts\n"
        "        |-- app.routes.ts\n"
        "        |-- components/\n"
        "        |   |-- login/\n"
        "        |   |-- layout/\n"
        "        |   |-- dashboard/\n"
        "        |   |-- usuarios/\n"
        "        |   |-- productos/\n"
        "        |   |-- clientes/\n"
        "        |   `-- facturas/\n"
        "        |-- services/\n"
        "        |-- models/\n"
        "        `-- guards/"
    ))

    historia.append(Paragraph("5.1 Responsabilidades por carpeta", subtitulo_seccion))
    resp = [
        [Paragraph("Carpeta", celda_enc), Paragraph("Responsabilidad", celda_enc)],
        [Paragraph("src/app/components/", celda), Paragraph("Componentes de presentación. Un componente por funcionalidad de negocio.", celda)],
        [Paragraph("src/app/services/", celda), Paragraph("Lógica de acceso a datos y reglas de negocio. Actualmente simula una API REST.", celda)],
        [Paragraph("src/app/models/", celda), Paragraph("Interfaces TypeScript que modelan las entidades del dominio del sistema.", celda)],
        [Paragraph("src/app/guards/", celda), Paragraph("Funciones de protección de rutas (autenticación).", celda)],
        [Paragraph("docs/", celda), Paragraph("Documentación oficial del proyecto.", celda)],
        [Paragraph("public/", celda), Paragraph("Archivos estáticos servidos en la raíz (favicon.ico).", celda)],
    ]
    historia.append(tabla_generica(resp, [5.5 * cm, 11 * cm]))
    historia.append(Spacer(1, 0.3 * cm))
    historia.append(bloque_nota(
        "Existe una carpeta ejemplo01/ duplicada en la raíz del repositorio que no está rastreada por Git "
        "(git ls-files ejemplo01 no devuelve resultados). Debe eliminarse o ignorarse explícitamente.",
        "Advertencia"))
    historia.append(PageBreak())


def nomenclatura(historia):
    historia.append(Paragraph("6. Convenciones de nomenclatura", titulo_seccion))
    historia.append(Paragraph(
        "Las siguientes convenciones han sido verificadas contra el código real del proyecto.", cuerpo))
    datos = [
        [Paragraph("Elemento", celda_enc), Paragraph("Convención", celda_enc), Paragraph("Ejemplo real", celda_enc)],
        [Paragraph("Interfaces y tipos", celda), Paragraph("PascalCase", celda), Paragraph("Usuario, AuthResponse, EstadoFactura", celda)],
        [Paragraph("Componentes", celda), Paragraph("PascalCase + Component", celda), Paragraph("LoginComponent, UsuariosComponent", celda)],
        [Paragraph("Servicios", celda), Paragraph("PascalCase + Service", celda), Paragraph("AuthService, FacturasService", celda)],
        [Paragraph("Guardas", celda), Paragraph("camelCase + Guard", celda), Paragraph("authGuard", celda)],
        [Paragraph("Métodos", celda), Paragraph("camelCase", celda), Paragraph("obtenerTodos(), toggleSidebar()", celda)],
        [Paragraph("Propiedades privadas", celda), Paragraph("private readonly + camelCase", celda), Paragraph("private readonly mockUsuarios", celda)],
        [Paragraph("Signales", celda), Paragraph("camelCase sin prefijo $", celda), Paragraph("usuarioActual, sidebarCollapsed, cargando", celda)],
        [Paragraph("Variables inyectadas", celda), Paragraph("camelCase + Service", celda), Paragraph("private usuariosService = inject(UsuariosService)", celda)],
        [Paragraph("Archivos / carpetas", celda), Paragraph("kebab-case", celda), Paragraph("usuario.model.ts, login.component.ts", celda)],
    ]
    historia.append(tabla_generica(datos, [4 * cm, 4.5 * cm, 8 * cm]))

    historia.append(Spacer(1, 0.4 * cm))
    historia.append(Paragraph("Ejemplo correcto", subtitulo_seccion))
    historia.append(bloque_codigo(
        "export interface Usuario {\n"
        "  id: number;\n"
        "  nombre: string;\n"
        "}\n"
        "\n"
        "private usuariosService = inject(UsuariosService);\n"
        "usuariosFiltrados = signal<Usuario[]>([]);"
    ))
    historia.append(Paragraph("Ejemplo incorrecto", subtitulo_seccion))
    historia.append(bloque_codigo(
        "export interface usuario {\n"
        "  ID: number;\n"
        "  nombre_completo: string;\n"
        "}\n"
        "\n"
        "private _service = inject(UsuariosService);\n"
        "$usuariosFiltrados = signal<Usuario[]>([]);"
    ))
    historia.append(PageBreak())


def componentes(historia):
    historia.append(Paragraph("7. Estándares para componentes", titulo_seccion))

    historia.append(Paragraph("7.1 Arquitectura standalone", subtitulo_seccion))
    historia.append(bloque_codigo(
        "@Component({\n"
        "  selector: 'app-usuarios',\n"
        "  standalone: true,\n"
        "  imports: [CommonModule, FormsModule],\n"
        "  templateUrl: './usuarios.component.html',\n"
        "  styleUrls: ['./usuarios.component.css']\n"
        "})"
    ))

    historia.append(Paragraph("7.2 Tamaño máximo", subtitulo_seccion))
    historia.append(Paragraph(
        "Si un componente supera las <b>200 líneas</b>, debe separarse en archivos: .ts (lógica), "
        ".html (template) y .css (estilos).", cuerpo))
    tam = [
        [Paragraph("Componente", celda_enc), Paragraph("Líneas", celda_enc), Paragraph("Acción recomendada", celda_enc)],
        [Paragraph("DashboardComponent", celda), Paragraph("464", celda), Paragraph("Extraer template y estilos", celda)],
        [Paragraph("LayoutComponent", celda), Paragraph("398", celda), Paragraph("Extraer template y estilos", celda)],
        [Paragraph("UsuariosComponent", celda), Paragraph("384", celda), Paragraph("Extraer estilos", celda)],
        [Paragraph("LoginComponent", celda), Paragraph("354", celda), Paragraph("Extraer estilos", celda)],
        [Paragraph("ProductosComponent", celda), Paragraph("237", celda), Paragraph("Extraer estilos", celda)],
    ]
    historia.append(tabla_generica(tam, [5.5 * cm, 2.5 * cm, 8.5 * cm]))

    historia.append(Paragraph("7.3 Control de flujo nativo", subtitulo_seccion))
    historia.append(bloque_codigo(
        "@for (usuario of usuariosFiltrados(); track usuario.id) {\n"
        "  <tr><td>{{ usuario.nombre }}</td></tr>\n"
        "} @empty {\n"
        "  <tr><td colspan=\"7\" class=\"empty-state\">No se encontraron usuarios</td></tr>\n"
        "}"
    ))
    historia.append(bloque_nota(
        "Prohibido *ngIf y *ngFor para código nuevo. Toda iteración @for debe usar track con ID único.",
        "Regla"))

    historia.append(Paragraph("7.4 Patrón de listado", subtitulo_seccion))
    historia.append(bloque_codigo(
        "export class UsuariosComponent implements OnInit {\n"
        "  private usuariosService = inject(UsuariosService);\n"
        "  usuarios: Usuario[] = [];\n"
        "  usuariosFiltrados = signal<Usuario[]>([]);\n"
        "  cargando = signal(true);\n"
        "\n"
        "  ngOnInit(): void { this.cargarUsuarios(); }\n"
        "\n"
        "  private cargarUsuarios(): void {\n"
        "    this.cargando.set(true);\n"
        "    this.usuariosService.obtenerTodos().subscribe({\n"
        "      next: (data) => { this.usuarios = data; this.usuariosFiltrados.set(data); this.cargando.set(false); },\n"
        "      error: () => this.cargando.set(false)\n"
        "    });\n"
        "  }\n"
        "}"
    ))
    historia.append(PageBreak())


def servicios(historia):
    historia.append(Paragraph("8. Estándares para servicios", titulo_seccion))

    historia.append(Paragraph("8.1 Definición y barril", subtitulo_seccion))
    historia.append(bloque_codigo(
        "@Injectable({ providedIn: 'root' })\n"
        "export class UsuariosService { ... }\n"
        "\n"
        "// services/index.ts\n"
        "export { UsuariosService } from './usuarios.service';"
    ))

    historia.append(Paragraph("8.2 Interfaz CRUD uniforme", subtitulo_seccion))
    historia.append(Paragraph(
        "Los 4 servicios de negocio (UsuariosService, ProductosService, ClientesService, FacturasService) "
        "implementan la misma firma CRUD:", cuerpo))
    historia.append(bloque_codigo(
        "obtenerTodos(): Observable<Modelo[]>;\n"
        "obtenerPorId(id: number): Observable<Modelo | undefined>;\n"
        "crear(entity: Omit<Modelo, 'id'>): Observable<Modelo>;\n"
        "actualizar(entity: Modelo): Observable<Modelo>;\n"
        "eliminar(id: number): Observable<boolean>;"
    ))

    historia.append(Paragraph("8.3 Simulación de latencia", subtitulo_seccion))
    lat = [
        [Paragraph("Operación", celda_enc), Paragraph("Retardo", celda_enc), Paragraph("Método", celda_enc)],
        [Paragraph("Lista completa", celda), Paragraph("500 ms", celda), Paragraph("obtenerTodos()", celda)],
        [Paragraph("Búsqueda por ID", celda), Paragraph("300 ms", celda), Paragraph("obtenerPorId(id)", celda)],
        [Paragraph("Autenticación", celda), Paragraph("800 ms", celda), Paragraph("login(credenciales)", celda)],
        [Paragraph("Operaciones CRUD", celda), Paragraph("500 ms", celda), Paragraph("crear, actualizar", celda)],
        [Paragraph("Eliminación", celda), Paragraph("300 ms", celda), Paragraph("eliminar(id)", celda)],
    ]
    historia.append(tabla_generica(lat, [4.5 * cm, 3 * cm, 8.5 * cm]))

    historia.append(Paragraph("8.4 Tipado estricto", subtitulo_seccion))
    historia.append(bloque_codigo(
        "// Debe corregirse en FacturasService:\n"
        "actualizarEstado(id: number, estado: string) // Incorrecto\n"
        "actualizarEstado(id: number, estado: EstadoFactura) // Correcto"
    ))
    historia.append(PageBreak())


def modelos(historia):
    historia.append(Paragraph("9. Estándares para modelos", titulo_seccion))

    historia.append(Paragraph("9.1 Documentación @property", subtitulo_seccion))
    historia.append(bloque_codigo(
        "/**\n"
        " * @property id - Identificador numérico único del usuario\n"
        " * @property nombre - Nombre completo del usuario\n"
        " */\n"
        "export interface Usuario {\n"
        "  id: number;\n"
        "  nombre: string;\n"
        "  email: string;\n"
        "}"
    ))

    historia.append(Paragraph("9.2 Tipos unión para estados", subtitulo_seccion))
    historia.append(bloque_codigo(
        "export type EstadoFactura = 'PENDIENTE' | 'PAGADA' | 'ANULADA' | 'VENCIDA';"
    ))

    historia.append(Paragraph("9.3 Composición sobre herencia", subtitulo_seccion))
    historia.append(bloque_codigo(
        "export interface Factura {\n"
        "  cliente: Cliente;\n"
        "  detalles: DetalleFactura[];\n"
        "  estado: EstadoFactura;\n"
        "}"
    ))

    historia.append(Paragraph("9.4 Barriles de importación", subtitulo_seccion))
    historia.append(bloque_codigo(
        "// models/index.ts\n"
        "export { type Usuario, type Credenciales, type AuthResponse } from './usuario.model';\n"
        "export { type Producto } from './producto.model';\n"
        "\n"
        "// Uso correcto en componentes\n"
        "import { Usuario, Credenciales, AuthResponse } from '../models';"
    ))
    historia.append(PageBreak())


def guards(historia):
    historia.append(Paragraph("10. Estándares para guards", titulo_seccion))
    historia.append(Paragraph(
        "Las guardas deben implementarse como <b>funciones</b> (CanActivateFn), no como clases.", cuerpo))
    historia.append(bloque_codigo(
        "export const authGuard: CanActivateFn = (): boolean | UrlTree => {\n"
        "  const authService = inject(AuthService);\n"
        "  const router = inject(Router);\n"
        "\n"
        "  if (authService.isAuthenticated()) {\n"
        "    return true;  // Permite el acceso\n"
        "  }\n"
        "  return router.parseUrl('/login');  // Redirige al login\n"
        "};"
    ))
    historia.append(bloque_nota(
        "Reglas: usar inject() dentro de la función, retornar true para permitir, retornar UrlTree "
        "con router.parseUrl() para redirigir, y verificar isAuthenticated() del servicio.",
        "Regla"))
    historia.append(PageBreak())


def routing(historia):
    historia.append(Paragraph("11. Routing", titulo_seccion))

    historia.append(Paragraph("11.1 Carga perezosa obligatoria", subtitulo_seccion))
    historia.append(bloque_codigo(
        "{\n"
        "  path: 'dashboard',\n"
        "  loadComponent: () =>\n"
        "    import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),\n"
        "  title: 'Dashboard - Sistema Empresarial'\n"
        "}"
    ))

    historia.append(Paragraph("11.2 Títulos de página obligatorios", subtitulo_seccion))
    rutas = [
        [Paragraph("Ruta", celda_enc), Paragraph("Título", celda_enc)],
        [Paragraph("/login", celda), Paragraph("Inicio de Sesión - Sistema Empresarial", celda)],
        [Paragraph("/dashboard", celda), Paragraph("Dashboard - Sistema Empresarial", celda)],
        [Paragraph("/usuarios", celda), Paragraph("Usuarios - Sistema Empresarial", celda)],
        [Paragraph("/productos", celda), Paragraph("Productos - Sistema Empresarial", celda)],
        [Paragraph("/clientes", celda), Paragraph("Clientes - Sistema Empresarial", celda)],
        [Paragraph("/facturas", celda), Paragraph("Facturas - Sistema Empresarial", celda)],
        [Paragraph("/**", celda), Paragraph("redirectTo: '/dashboard'", celda)],
    ]
    historia.append(tabla_generica(rutas, [4 * cm, 12 * cm]))

    historia.append(Paragraph("11.3 Protección de rutas", subtitulo_seccion))
    historia.append(bloque_codigo(
        "{\n"
        "  path: '',\n"
        "  canActivate: [authGuard],\n"
        "  loadComponent: () =>\n"
        "    import('./components/layout/layout.component').then(m => m.LayoutComponent),\n"
        "  children: [ /* rutas hijas del dashboard */ ]\n"
        "}"
    ))
    historia.append(PageBreak())


def formularios(historia):
    historia.append(Paragraph("12. Formularios", titulo_seccion))
    historia.append(Paragraph(
        "El proyecto utiliza <b>formularios template-driven</b> con FormsModule y ngModel.", cuerpo))
    historia.append(bloque_codigo(
        "<form (ngSubmit)=\"onSubmit()\" class=\"login-form\">\n"
        "  <input\n"
        "    id=\"usuario\"\n"
        "    type=\"text\"\n"
        "    [(ngModel)]=\"credenciales.usuario\"\n"
        "    name=\"usuario\"\n"
        "    required\n"
        "    autocomplete=\"username\"\n"
        "  />\n"
        "</form>"
    ))
    historia.append(bloque_nota(
        "Reglas: todo control con ngModel debe definir name; los formularios de login deben incluir "
        "autocomplete; validar en onSubmit() y mostrar errorMensaje.", "Regla"))
    historia.append(bloque_nota(
        "No se usa ReactiveFormsModule en el código actual. Los formularios reactivos (FormGroup, "
        "FormControl) se consideran una recomendación futura para formularios complejos.", "Recomendación"))
    historia.append(PageBreak())


def typescript(historia):
    historia.append(Paragraph("13. Buenas prácticas TypeScript", titulo_seccion))

    historia.append(Paragraph("13.1 Opciones estrictas (no desactivar)", subtitulo_seccion))
    opts = [
        [Paragraph("Opción", celda_enc), Paragraph("Valor", celda_enc)],
        [Paragraph("noImplicitOverride", celda), Paragraph("true", celda)],
        [Paragraph("noPropertyAccessFromIndexSignature", celda), Paragraph("true", celda)],
        [Paragraph("noImplicitReturns", celda), Paragraph("true", celda)],
        [Paragraph("noFallthroughCasesInSwitch", celda), Paragraph("true", celda)],
        [Paragraph("isolatedModules", celda), Paragraph("true", celda)],
        [Paragraph("experimentalDecorators", celda), Paragraph("true", celda)],
        [Paragraph("target", celda), Paragraph("ES2022", celda)],
    ]
    historia.append(tabla_generica(opts, [8 * cm, 4 * cm]))

    historia.append(Paragraph("13.2 Tipado explícito y readonly", subtitulo_seccion))
    historia.append(bloque_codigo(
        "// Correcto\n"
        "private readonly mockUsuarios: Usuario[] = [/* ... */];\n"
        "credenciales: Credenciales = { usuario: '', contrasena: '' };\n"
        "\n"
        "// Incorrecto\n"
        "private mockUsuarios = [];\n"
        "credenciales = {};"
    ))

    historia.append(Paragraph("13.3 Omit<T, 'id'> en creación", subtitulo_seccion))
    historia.append(bloque_codigo(
        "crear(cliente: Omit<Cliente, 'id'>): Observable<Cliente>  // Correcto\n"
        "crear(cliente: Cliente): Observable<Cliente>              // Incorrecto"
    ))
    historia.append(PageBreak())


def angular_bp(historia):
    historia.append(Paragraph("14. Buenas prácticas Angular", titulo_seccion))

    historia.append(Paragraph("14.1 Inyección con inject()", subtitulo_seccion))
    historia.append(bloque_codigo(
        "// Correcto\n"
        "private facturasService = inject(FacturasService);\n"
        "private router = inject(Router);\n"
        "\n"
        "// Incorrecto\n"
        "constructor(private facturasService: FacturasService) {}"
    ))

    historia.append(Paragraph("14.2 Señales (Signals)", subtitulo_seccion))
    historia.append(bloque_codigo(
        "private usuarioActual = signal<Usuario | null>(null);\n"
        "readonly isAuthenticated = computed(() => this.usuarioActual() !== null);\n"
        "sidebarCollapsed = signal(false);"
    ))

    historia.append(Paragraph("14.3 Exponer Observables desde servicios", subtitulo_seccion))
    historia.append(bloque_codigo(
        "obtenerTodos(): Observable<Usuario[]> {\n"
        "  return of([...this.mockUsuarios]).pipe(delay(500));\n"
        "}"
    ))
    historia.append(PageBreak())


def rxjs_bp(historia):
    historia.append(Paragraph("15. Buenas prácticas RxJS", titulo_seccion))

    historia.append(Paragraph("15.1 Suscripciones con {next, error}", subtitulo_seccion))
    historia.append(bloque_codigo(
        "this.authService.login(this.credenciales).subscribe({\n"
        "  next: (respuesta) => {\n"
        "    this.cargando = false;\n"
        "    if (respuesta.success) { this.router.navigate(['/dashboard']); }\n"
        "  },\n"
        "  error: () => {\n"
        "    this.cargando = false;\n"
        "    this.errorMensaje = 'Error de conexión. Intente nuevamente.';\n"
        "  }\n"
        "});"
    ))

    historia.append(Paragraph("15.2 Manejo de errores obligatorio", subtitulo_seccion))
    historia.append(bloque_nota(
        "El componente LoginComponent es el único que cumple la regla actualmente; los listados usan "
        "error: () => this.cargando.set(false) sin feedback. Toda suscripción DEBE manejar error con "
        "feedback al usuario o al menos log.", "Corrección requerida"))

    historia.append(bloque_nota(
        "Los observables actuales provienen de of() y no producen errores en la práctica. Sin embargo, "
        "el handler error es obligatorio para preparar la migración a HttpClient.", "Nota"))

    historia.append(bloque_nota(
        "Usar takeUntilDestroyed() cuando se introduzcan streams infinitos o suscripciones persistentes.",
        "Recomendación futura"))
    historia.append(PageBreak())


def material(historia):
    historia.append(Paragraph("16. Angular Material", titulo_seccion))
    historia.append(Paragraph(
        "<b>Estado actual:</b> @angular/material y @angular/cdk están instalados y styles.css contiene "
        "reglas de personalización (.mat-toolbar, .mat-mdc-card, .mat-mdc-header-row, .mat-mdc-form-field). "
        "Sin embargo, <b>ningún template importa o utiliza componentes de Angular Material</b>.", cuerpo))

    historia.append(Paragraph("Regla aplicable", subtitulo_seccion))
    historia.append(Paragraph(
        "No es obligatorio usar Angular Material. Los componentes de UI del proyecto son HTML/CSS nativos "
        "personalizados. Las reglas CSS existentes en styles.css se conservan para preparar su adopción.", cuerpo))

    historia.append(bloque_nota(
        "Si se adoptan componentes Material, deberá definirse un tema oficial (indigo #1a237e, teal "
        "#00897b, rojo #d32f2f) y documentar su uso en una nueva sección del manual.",
        "Recomendación futura"))
    historia.append(PageBreak())


def tailwind(historia):
    historia.append(Paragraph("17. Tailwind CSS", titulo_seccion))
    historia.append(Paragraph(
        "<b>Estado actual:</b> Tailwind 4 está configurado (@import \"tailwindcss\" en styles.css, plugin "
        "en .postcssrc.json). Los templates <b>no utilizan clases utilitarias</b>; todo el estilo se basa "
        "en CSS scoped personalizado por componente.", cuerpo))

    historia.append(Paragraph("Regla aplicable", subtitulo_seccion))
    historia.append(Paragraph(
        "No introducir clases utilitarias de Tailwind en templates sin aprobación de revisión. Mantener "
        "la consistencia con el sistema de estilos actual: CSS scoped en el componente o estilos globales "
        "en styles.css.", cuerpo))

    historia.append(bloque_nota(
        "Adoptar gradualmente Tailwind para utilidades puntuales (layout, espaciado, responsive) "
        "pero definiendo primero una guía de tokens de diseño.", "Recomendación futura"))
    historia.append(PageBreak())


def calidad(historia):
    historia.append(Paragraph("18. Calidad del código", titulo_seccion))

    historia.append(Paragraph("18.1 Formato", subtitulo_seccion))
    fmt = [
        [Paragraph("Regla", celda_enc), Paragraph("Configuración", celda_enc)],
        [Paragraph("Indentación", celda), Paragraph("2 espacios", celda)],
        [Paragraph("Comillas", celda), Paragraph("Simples", celda)],
        [Paragraph("Ancho de línea", celda), Paragraph("100 columnas", celda)],
        [Paragraph("Salto de línea final", celda), Paragraph("Obligatorio", celda)],
        [Paragraph("Espacios al final de línea", celda), Paragraph("Prohibidos", celda)],
    ]
    historia.append(tabla_generica(fmt, [6 * cm, 10 * cm]))
    historia.append(bloque_nota("Fuentes de verdad: .prettierrc y .editorconfig.", "Nota"))

    historia.append(Paragraph("18.2 Documentación interna (banner)", subtitulo_seccion))
    historia.append(bloque_codigo(
        "/**\n"
        " * ============================================================\n"
        " * SERVICIO: ProductosService\n"
        " * ============================================================\n"
        " * Proposito: Servicio que simula (Mock) las operaciones CRUD\n"
        " * para la gestion del inventario de productos.\n"
        " * ============================================================\n"
        " */"
    ))

    historia.append(Paragraph("18.3 Idioma", subtitulo_seccion))
    historia.append(Paragraph(
        "Todo el código (identificadores, comentarios, mensajes UI) se escribe en <b>español</b>.", cuerpo))
    historia.append(bloque_codigo(
        "// Correcto\n"
        "cargarUsuarios(), errorMensaje, 'Por favor ingrese usuario y contraseña'\n"
        "\n"
        "// Incorrecto\n"
        "loadUsers(), errorMessage, 'Please enter your credentials'"
    ))
    historia.append(PageBreak())


def clean_code(historia):
    historia.append(Paragraph("19. Clean Code", titulo_seccion))
    items = [
        "<b>Nombres descriptivos:</b> los métodos dicen qué hacen (obtenerTodos(), toggleSidebar(), cerrarSesion()).",
        "<b>Funciones pequeñas:</b> cada método tiene una única responsabilidad (cargarDatos(), actualizarTarjetas(), buscar()).",
        "<b>Sin magia:</b> los datos mock documentan su propósito con comentarios.",
        "<b>Legibilidad:</b> los templates usan clases con nombres semánticos (login-card, stat-card, table-container).",
        "<b>Manejo defensivo:</b> try/catch al parsear localStorage (auth.service.ts).",
    ]
    historia.append(ListFlowable(
        [ListItem(Paragraph(i, cuerpo_bullet)) for i in items], bulletType="bullet"))

    historia.append(Paragraph("Ejemplo correcto", subtitulo_seccion))
    historia.append(bloque_codigo(
        "private cargarSesion(): void {\n"
        "  if (isPlatformBrowser(this.platformId)) {\n"
        "    const sesionGuardada = localStorage.getItem('auth_user');\n"
        "    if (sesionGuardada) {\n"
        "      try {\n"
        "        this.usuarioActual.set(JSON.parse(sesionGuardada));\n"
        "      } catch {\n"
        "        localStorage.removeItem('auth_user');\n"
        "      }\n"
        "    }\n"
        "  }\n"
        "}"
    ))
    historia.append(PageBreak())


def solid(historia):
    historia.append(Paragraph("20. SOLID", titulo_seccion))
    datos = [
        [Paragraph("Principio", celda_enc), Paragraph("Aplicación en el proyecto", celda_enc)],
        [Paragraph("S - Responsabilidad única", celda), Paragraph("Cada servicio gestiona una sola entidad (UsuariosService → usuarios).", celda)],
        [Paragraph("O - Abierto/Cerrado", celda), Paragraph("Los modelos extienden comportamiento mediante composición, no modificación.", celda)],
        [Paragraph("L - Sustitución", celda), Paragraph("Las interfaces tipan contratos; los servicios devuelven exactamente el modelo.", celda)],
        [Paragraph("I - Segregación", celda), Paragraph("Los componentes consumen solo los métodos que necesitan.", celda)],
        [Paragraph("D - Inversión", celda), Paragraph("Los componentes dependen de servicios, no de implementaciones concretas.", celda)],
    ]
    historia.append(tabla_generica(datos, [5.5 * cm, 11 * cm]))
    historia.append(bloque_nota(
        "Para reforzar D, considerar definir una interfaz de contrato por servicio (ej. CrudService<T>) "
        "que abstraiga las operaciones CRUD y permita reemplazar el mock por HttpClient sin tocar componentes.",
        "Recomendación"))
    historia.append(PageBreak())


def dry(historia):
    historia.append(Paragraph("21. DRY (Don't Repeat Yourself)", titulo_seccion))
    historia.append(Paragraph("Hallazgo real: existe duplicidad verificada en el proyecto:", cuerpo))
    items = [
        "<b>Estilos copiados:</b> los componentes productos, clientes y facturas comparten bloques CSS idénticos (page, btn-primary, table, badge, spinner).",
        "<b>Patrón cargar:</b> se repite en los 4 listados con la misma estructura (cargando.set(true) → subscribe → set()).",
        "<b>Patrón buscar:</b> filtrado con toLowerCase().includes() repetido en usuarios, productos, clientes y facturas.",
        "<b>Botones y acciones:</b> btn-edit / btn-delete con alert()/confirm() idénticos.",
    ]
    historia.append(ListFlowable(
        [ListItem(Paragraph(i, cuerpo_bullet)) for i in items], bulletType="bullet"))

    historia.append(Paragraph("Plan de corrección", subtitulo_seccion))
    items2 = [
        "Centralizar las clases comunes (tablas, botones, badges, estados vacíos, loader) en styles.css.",
        "Evaluar la creación de una utilidad o función compartida para la carga y filtrado de listados.",
    ]
    historia.append(ListFlowable(
        [ListItem(Paragraph(i, cuerpo_bullet)) for i in items2], bulletType="bullet"))
    historia.append(PageBreak())


def kiss(historia):
    historia.append(Paragraph("22. KISS (Keep It Simple, Stupid)", titulo_seccion))
    items = [
        "Los servicios exponen observables pequeños y predecibles.",
        "Las señales simplifican el flujo de datos sin librerías de estado externas.",
        "El flujo de autenticación es directo y comprensible.",
        "El proyecto evita complejidad innecesaria: sin NgRx, sin servicios HTTP, sin formularios reactivos hasta que se necesiten.",
    ]
    historia.append(ListFlowable(
        [ListItem(Paragraph(i, cuerpo_bullet)) for i in items], bulletType="bullet"))
    historia.append(PageBreak())


def seguridad(historia):
    historia.append(Paragraph("23. Seguridad", titulo_seccion))

    historia.append(Paragraph("23.1 Protección de rutas", subtitulo_seccion))
    historia.append(bloque_codigo(
        "if (authService.isAuthenticated()) {\n"
        "  return true;\n"
        "}\n"
        "return router.parseUrl('/login');"
    ))

    historia.append(Paragraph("23.2 Persistencia segura en SSR", subtitulo_seccion))
    historia.append(bloque_codigo(
        "// Correcto\n"
        "if (isPlatformBrowser(this.platformId)) {\n"
        "  localStorage.setItem('auth_user', JSON.stringify(this.mockUsuario));\n"
        "}\n"
        "\n"
        "// Incorrecto\n"
        "localStorage.setItem('auth_user', JSON.stringify(this.mockUsuario));"
    ))

    historia.append(Paragraph("23.3 Credenciales de demostración", subtitulo_seccion))
    historia.append(bloque_nota(
        "Las credenciales admin / admin123 están hardcodeadas en AuthService con fines educativos. "
        "No deben utilizarse en producción. Si el sistema se conecta a un backend real, estas credenciales "
        "deben eliminarse y sustituirse por autenticación segura (tokens, hashing, HTTPS).",
        "Advertencia"))
    historia.append(PageBreak())


def rendimiento(historia):
    historia.append(Paragraph("24. Rendimiento", titulo_seccion))
    items = [
        "<b>Presupuestos de bundle:</b> angular.json define budgets de producción de 500 kB (advertencia) / 1 MB (error) para el bundle inicial.",
        "<b>Carga perezosa:</b> todas las rutas cargan sus componentes bajo demanda, lo que reduce el bundle inicial.",
        "<b>Inmutabilidad de datos mock:</b> los arrays internos (mockProductos, mockClientes) se copian con spread [...] lo que evita efectos secundarios.",
        "<b>Pipes puros:</b> usar currency y date (pipes puros de Angular) ya es correcto.",
    ]
    historia.append(ListFlowable(
        [ListItem(Paragraph(i, cuerpo_bullet)) for i in items], bulletType="bullet"))
    historia.append(bloque_nota(
        "Evitar llamadas redundantes: DashboardComponent llama a los 4 servicios en ngOnInit; "
        "considerar forkJoin cuando sea necesario.", "Recomendación"))
    historia.append(PageBreak())


def accesibilidad(historia):
    historia.append(Paragraph("25. Accesibilidad", titulo_seccion))
    historia.append(Paragraph("Prácticas presentes en el proyecto:", subtitulo_seccion))
    items = [
        "label con atributo for vinculado al id del input en LoginComponent.",
        "autocomplete=\"username\" y autocomplete=\"current-password\" en el formulario de login.",
        "title en botones de icono (title=\"Editar\", title=\"Eliminar\", title=\"Cerrar sesión\").",
        "lang=\"es\" en index.html.",
    ]
    historia.append(ListFlowable(
        [ListItem(Paragraph(i, cuerpo_bullet)) for i in items], bulletType="bullet"))

    historia.append(Paragraph("Recomendaciones", subtitulo_seccion))
    items2 = [
        "Añadir aria-label a los botones que solo contienen iconos.",
        "Asegurar contraste suficiente (verificar pares como #1a237e sobre blanco).",
        "Probar navegación con teclado en tablas y modales.",
    ]
    historia.append(ListFlowable(
        [ListItem(Paragraph(i, cuerpo_bullet)) for i in items2], bulletType="bullet"))
    historia.append(PageBreak())


def git(historia):
    historia.append(Paragraph("26. Git", titulo_seccion))
    historia.append(bloque_codigo(
        "# Ver estado del repositorio\n"
        "git status\n\n"
        "# Ver cambios realizados\n"
        "git diff\n\n"
        "# Añadir archivos al área de staging\n"
        "git add <archivo>\n\n"
        "# Crear un commit con mensaje descriptivo\n"
        "git commit -m \"fix: corregir validación de login\"\n\n"
        "# Subir cambios a la rama remota\n"
        "git push origin main"
    ))

    historia.append(Paragraph("Historial verificado del repositorio", subtitulo_seccion))
    commits = [
        [Paragraph("Commit", celda_enc), Paragraph("Descripción", celda_enc)],
        [Paragraph("9ad3b15", celda), Paragraph("Initial commit: Proyecto AG - Angular application", celda)],
        [Paragraph("1de5d13", celda), Paragraph("docs: agrega estandares de codificacion del proyecto", celda)],
        [Paragraph("3b746c6", celda), Paragraph("docs: agregar manual de estandares de codificacion en carpeta docs", celda)],
    ]
    historia.append(tabla_generica(commits, [3.5 * cm, 13 * cm]))
    historia.append(PageBreak())


def commits(historia):
    historia.append(Paragraph("27. Convenciones de commits", titulo_seccion))
    historia.append(bloque_codigo("<tipo>: <descripción en presente, minúsculas>"))
    datos = [
        [Paragraph("Prefijo", celda_enc), Paragraph("Uso", celda_enc), Paragraph("Ejemplo", celda_enc)],
        [Paragraph("feat:", celda), Paragraph("Nueva funcionalidad", celda), Paragraph("feat: agregar módulo de facturación", celda)],
        [Paragraph("fix:", celda), Paragraph("Corrección de errores", celda), Paragraph("fix: corregir validación de login", celda)],
        [Paragraph("docs:", celda), Paragraph("Cambios en documentación", celda), Paragraph("docs: actualizar manual de estándares", celda)],
        [Paragraph("refactor:", celda), Paragraph("Mejora sin cambiar comportamiento", celda), Paragraph("refactor: simplificar servicio de usuarios", celda)],
        [Paragraph("style:", celda), Paragraph("Formato sin afectar lógica", celda), Paragraph("style: aplicar formato prettier", celda)],
        [Paragraph("test:", celda), Paragraph("Pruebas", celda), Paragraph("test: agregar pruebas de auth", celda)],
        [Paragraph("chore:", celda), Paragraph("Mantenimiento", celda), Paragraph("chore: actualizar dependencias", celda)],
    ]
    historia.append(tabla_generica(datos, [2.5 * cm, 5 * cm, 9 * cm]))
    historia.append(Spacer(1, 0.3 * cm))
    historia.append(bloque_codigo(
        "# Correcto\n"
        "git commit -m \"docs: agregar manual de estándares de codificación\"\n\n"
        "# Incorrecto\n"
        "git commit -m \"cambios\""
    ))
    historia.append(PageBreak())


def estrategia_ramas(historia):
    historia.append(Paragraph("28. Estrategia de ramas", titulo_seccion))
    historia.append(bloque_codigo(
        "main\n"
        "  |-- feature/nombre-funcionalidad\n"
        "  `-- hotfix/nombre-correccion\n\n"
        "Flujo recomendado:\n"
        "  1. git checkout -b feature/nombre-funcionalidad\n"
        "  2. Realizar commits pequeños y descriptivos\n"
        "  3. Abrir un Pull Request hacia main\n"
        "  4. Integrar tras la aprobación del revisor"
    ))
    historia.append(PageBreak())


def pull_requests(historia):
    historia.append(Paragraph("29. Pull Requests", titulo_seccion))
    items = [
        "<b>Descripción clara:</b> qué se cambia, por qué, y cómo se probó.",
        "<b>Commits atómicos:</b> un commit por cambio lógico.",
        "<b>Sin errores de build:</b> ejecutar ng build antes de abrir o fusionar.",
        "<b>Sin conflictos:</b> ejecutar git pull --rebase origin main antes de fusionar.",
    ]
    historia.append(ListFlowable(
        [ListItem(Paragraph(i, cuerpo_bullet)) for i in items], bulletType="bullet"))
    historia.append(PageBreak())


def revision(historia):
    historia.append(Paragraph("30. Revisión de código", titulo_seccion))
    items = [
        "Cumple los estándares de nomenclatura (sección 6).",
        "Usa componentes standalone y lazy loading.",
        "Usa inject() y señales.",
        "Maneja errores en todas las suscripciones.",
        "No introduce duplicidad (DRY).",
        "Respeta los límites de tamaño de componente.",
        "Formato correcto con Prettier.",
        "Documentación con banner y @property.",
    ]
    historia.append(ListFlowable(
        [ListItem(Paragraph(i, cuerpo_bullet)) for i in items], bulletType="bullet"))
    historia.append(PageBreak())


def checklist(historia):
    historia.append(Paragraph("31. Checklist antes de integrar cambios", titulo_seccion))
    items = [
        "ng build compila sin errores.",
        "ng test pasa (cuando existan pruebas).",
        "Formato aplicado con Prettier.",
        "No hay clases utilitarias de Tailwind sin aprobación.",
        "No se desactivaron opciones estrictas del tsconfig.json.",
        "Toda suscripción tiene handler error.",
        "Los archivos nuevos incluyen banner de documentación.",
        "Se actualizó este manual si el estándar cambió.",
        "git status muestra solo los archivos intencionales.",
        "El commit usa el prefijo correcto.",
    ]
    lista = []
    for i in items:
        historia.append(Paragraph(f"✔ {i}", cuerpo_bullet))
    historia.append(Spacer(1, 0.3 * cm))
    historia.append(bloque_nota("Marcar todos los elementos antes de abrir un Pull Request.", "Regla"))
    historia.append(PageBreak())


def glosario(historia):
    historia.append(Paragraph("32. Glosario", titulo_seccion))
    datos = [
        [Paragraph("Término", celda_enc), Paragraph("Definición", celda_enc)],
        [Paragraph("Standalone", celda), Paragraph("Arquitectura Angular sin NgModules que usa imports directamente en el componente.", celda)],
        [Paragraph("Signal", celda), Paragraph("Primitiva reactiva de Angular para estado (signal(), computed()).", celda)],
        [Paragraph("Lazy loading", celda), Paragraph("Carga diferida de código bajo demanda mediante loadComponent.", celda)],
        [Paragraph("Barrel file", celda), Paragraph("Archivo index.ts que re-exporta módulos y simplifica importaciones.", celda)],
        [Paragraph("Mock", celda), Paragraph("Datos simulados que reemplazan un servicio real de backend.", celda)],
        [Paragraph("Guard", celda), Paragraph("Función (CanActivateFn) que protege rutas en Angular Router.", celda)],
        [Paragraph("CRUD", celda), Paragraph("Create, Read, Update, Delete — operaciones básicas de persistencia.", celda)],
    ]
    historia.append(tabla_generica(datos, [4 * cm, 12 * cm]))
    historia.append(PageBreak())


def referencias(historia):
    historia.append(Paragraph("33. Referencias", titulo_seccion))
    datos = [
        [Paragraph("Tema", celda_enc), Paragraph("Referencia", celda_enc)],
        [Paragraph("Angular", celda), Paragraph("https://angular.dev", celda)],
        [Paragraph("Angular Signals", celda), Paragraph("https://angular.dev/guide/signals", celda)],
        [Paragraph("Angular Routing", celda), Paragraph("https://angular.dev/guide/routing", celda)],
        [Paragraph("Angular Control Flow", celda), Paragraph("https://angular.dev/guide/templates/control-flow", celda)],
        [Paragraph("Lazy Loading", celda), Paragraph("https://angular.dev/guide/ngmodules/lazy-loading", celda)],
        [Paragraph("Conventional Commits", celda), Paragraph("https://www.conventionalcommits.org", celda)],
        [Paragraph("Prettier", celda), Paragraph("https://prettier.io", celda)],
        [Paragraph("Vitest", celda), Paragraph("https://vitest.dev", celda)],
        [Paragraph("RxJS", celda), Paragraph("https://rxjs.dev", celda)],
    ]
    historia.append(tabla_generica(datos, [5 * cm, 11 * cm]))
    historia.append(PageBreak())


def conclusiones(historia):
    historia.append(Paragraph("34. Conclusiones", titulo_seccion))
    historia.append(Paragraph(
        "El proyecto ejemplo01 cuenta con una arquitectura Angular moderna y limpia: standalone, lazy "
        "loading, señales, inyección funcional y control de flujo nativo. La documentación interna del "
        "código es ejemplar, con banners descriptivos en todos los archivos. El proyecto mantiene "
        "coherencia entre los módulos de negocio (usuarios, productos, clientes, facturas), servicios "
        "mock y modelos tipados.", cuerpo))
    historia.append(Paragraph(
        "Este manual establece el marco de estándares que el proyecto ya practica en su mayoría y define "
        "las correcciones necesarias: tipar correctamente los parámetros de estado, manejar errores en "
        "todas las suscripciones, separar componentes grandes, centralizar estilos duplicados y eliminar "
        "la carpeta ejemplo01/ no rastreada.", cuerpo))
    historia.append(Paragraph(
        "La aplicación de este manual convierte el repositorio en una base sólida para el crecimiento "
        "del sistema, ya sea incorporando un backend real, pruebas automatizadas o nuevos módulos de "
        "negocio.", cuerpo))
    historia.append(PageBreak())


def recomendaciones(historia):
    historia.append(Paragraph("35. Recomendaciones futuras", titulo_seccion))
    historia.append(Paragraph(
        "Las siguientes recomendaciones no describen el estado actual del proyecto y solo deberán "
        "incorporarse cuando se planifique su implementación:", cuerpo))
    datos = [
        [Paragraph("Área", celda_enc), Paragraph("Recomendación", celda_enc)],
        [Paragraph("Backend", celda), Paragraph("Conectar los servicios mock a una API REST con HttpClient e interceptores.", celda)],
        [Paragraph("Entornos", celda), Paragraph("Crear environments/environment.ts (dev) y environment.prod.ts.", celda)],
        [Paragraph("Pruebas", celda), Paragraph("Escribir pruebas unitarias con Vitest (ya configurado en tsconfig.spec.json).", celda)],
        [Paragraph("Formularios reactivos", celda), Paragraph("Migrar a ReactiveFormsModule cuando existan formularios complejos.", celda)],
        [Paragraph("Manejo de errores global", celda), Paragraph("Implementar un ErrorHandler global y mensajes de usuario estandarizados.", celda)],
        [Paragraph("Componentes compartidos", celda), Paragraph("Crear una carpeta shared/ para botones, tablas y badges reutilizables.", celda)],
        [Paragraph("Limpieza", celda), Paragraph("Eliminar la carpeta ejemplo01/ duplicada y verificar git status limpio.", celda)],
        [Paragraph("Assets", celda), Paragraph("Crear src/assets/ y añadir las imágenes referenciadas por Producto (laptop.png, etc.).", celda)],
        [Paragraph("Angular Material", celda), Paragraph("Adoptar componentes Material con un tema oficial cuando el sistema lo requiera.", celda)],
        [Paragraph("Tailwind", celda), Paragraph("Definir tokens de diseño y adoptar utilidades para layout y responsive.", celda)],
    ]
    historia.append(tabla_generica(datos, [4.5 * cm, 12 * cm]))
    historia.append(Spacer(1, 0.8 * cm))
    historia.append(Paragraph(
        f"<i>Documento generado a partir de la auditoría completa del repositorio {PROYECTO}. "
        f"Ficha SENA {FICHA} — Autor: {AUTOR}</i>",
        crear_estilo("PieDoc", parent=cuerpo, alignment=TA_CENTER, textColor=GRIS_SEC, fontSize=8.5)))


# ---------------------------------------------------------------
# Encabezado y pie de página (solo páginas interiores)
# ---------------------------------------------------------------

def encabezado_pie(canvas, doc):
    """Encabezado azul y pie de página con numeración, estilo documentación oficial."""
    if doc.page == 1:
        return

    canvas.saveState()

    # Barra superior índigo
    canvas.setFillColor(INDIGO)
    canvas.rect(0, doc.pagesize[1] - 1.1 * cm, doc.pagesize[0], 1.1 * cm, stroke=0, fill=1)
    canvas.setFillColor(BLANCO)
    canvas.setFont("Helvetica-Bold", 8)
    canvas.drawString(1.5 * cm, doc.pagesize[1] - 0.75 * cm, "Manual de Estándares de Codificación")
    canvas.setFont("Helvetica", 8)
    canvas.drawRightString(doc.pagesize[0] - 1.5 * cm, doc.pagesize[1] - 0.75 * cm, f"Versión 2.0 • {PROYECTO}")

    # Pie de página
    canvas.setFillColor(GRIS_CLARO_BG)
    canvas.rect(0, 0, doc.pagesize[0], 0.9 * cm, stroke=0, fill=1)
    canvas.setStrokeColor(GRIS_BORDE)
    canvas.setLineWidth(0.5)
    canvas.line(0, 0.9 * cm, doc.pagesize[0], 0.9 * cm)

    canvas.setFillColor(GRIS_SEC)
    canvas.setFont("Helvetica", 7.5)
    canvas.drawString(1.5 * cm, 0.35 * cm, f"SENA • Ficha {FICHA} • {AUTOR}")
    canvas.drawRightString(doc.pagesize[0] - 1.5 * cm, 0.35 * cm, f"Página {doc.page - 1}")

    canvas.restoreState()


def generar_pdf():
    """Genera el PDF completo del manual."""
    os.makedirs(DOCS_DIR, exist_ok=True)

    doc = BaseDocTemplate(
        OUTPUT_PDF,
        pagesize=A4,
        leftMargin=2 * cm,
        rightMargin=2 * cm,
        topMargin=2.0 * cm,
        bottomMargin=1.4 * cm,
        title="Manual de Estándares de Codificación del Proyecto",
        author=AUTOR,
        subject=f"Estándares de codificación - {PROYECTO}",
    )

    marco = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="marco")
    doc.addPageTemplates([PageTemplate(id="pagina", frames=[marco], onPage=encabezado_pie)])

    historia = []

    # Orden de construcción
    portada(historia)
    control_versiones(historia)
    indice(historia)
    introduccion(historia)
    objetivos(historia)
    alcance(historia)
    arquitectura(historia)
    organizacion(historia)
    nomenclatura(historia)
    componentes(historia)
    servicios(historia)
    modelos(historia)
    guards(historia)
    routing(historia)
    formularios(historia)
    typescript(historia)
    angular_bp(historia)
    rxjs_bp(historia)
    material(historia)
    tailwind(historia)
    calidad(historia)
    clean_code(historia)
    solid(historia)
    dry(historia)
    kiss(historia)
    seguridad(historia)
    rendimiento(historia)
    accesibilidad(historia)
    git(historia)
    commits(historia)
    estrategia_ramas(historia)
    pull_requests(historia)
    revision(historia)
    checklist(historia)
    glosario(historia)
    referencias(historia)
    conclusiones(historia)
    recomendaciones(historia)

    doc.build(historia)
    print(f"PDF generado correctamente en: {OUTPUT_PDF}")
    return OUTPUT_PDF


if __name__ == "__main__":
    generar_pdf()