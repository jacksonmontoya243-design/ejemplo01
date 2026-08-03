# -*- coding: utf-8 -*-
"""
Script de generación del Manual de Estándares de Codificación.
Genera el documento PDF 'Estandares_Codificacion.pdf' dentro de la carpeta 'docs/'.

Autor: Jackson Darley Montoya Mercado
Ficha SENA: 3118526
Proyecto: ejemplo01 (Aplicación Angular 22 - Sistema de Gestión Empresarial)
"""

import os
from datetime import datetime

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm, mm
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    Image,
    PageTemplate,
    Paragraph,
    PageBreak,
    Spacer,
    Table,
    TableStyle,
)

# ------------------------------------------------------------------
# Configuración de rutas y datos
# ------------------------------------------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DOCS_DIR = os.path.join(BASE_DIR, "docs")
OUTPUT_PDF = os.path.join(DOCS_DIR, "Estandares_Codificacion.pdf")

NOMBRE_AUTOR = "Jackson Darley Montoya Mercado"
FICHA_SENA = "3118526"
PROYECTO = "ejemplo01"
TECNOLOGIAS = "Angular 22 / TypeScript / Angular Material / Tailwind CSS"

# Colores institucionales SENA
VERDE_SENA = colors.HexColor("#39A900")
VERDE_OSCURO = colors.HexColor("#1F6B00")
GRIS_TEXTO = colors.HexColor("#333333")
GRIS_CLARO = colors.HexColor("#F2F2F2")
AZUL_ENCABEZADO = colors.HexColor("#0B3D91")

# ------------------------------------------------------------------
# Estilos de párrafo
# ------------------------------------------------------------------
styles = getSampleStyleSheet()

titulo_portada = ParagraphStyle(
    "TituloPortada",
    parent=styles["Title"],
    fontName="Helvetica-Bold",
    fontSize=26,
    leading=32,
    textColor=colors.white,
    alignment=TA_CENTER,
)

subtitulo_portada = ParagraphStyle(
    "SubtituloPortada",
    parent=styles["BodyText"],
    fontName="Helvetica",
    fontSize=15,
    leading=20,
    textColor=colors.HexColor("#D9D9D9"),
    alignment=TA_CENTER,
)

titulo_seccion = ParagraphStyle(
    "TituloSeccion",
    parent=styles["Heading1"],
    fontName="Helvetica-Bold",
    fontSize=18,
    leading=24,
    textColor=VERDE_OSCURO,
    spaceBefore=14,
    spaceAfter=10,
)

subtitulo_seccion = ParagraphStyle(
    "SubtituloSeccion",
    parent=styles["Heading2"],
    fontName="Helvetica-Bold",
    fontSize=13,
    leading=18,
    textColor=AZUL_ENCABEZADO,
    spaceBefore=10,
    spaceAfter=6,
)

cuerpo = ParagraphStyle(
    "Cuerpo",
    parent=styles["BodyText"],
    fontName="Helvetica",
    fontSize=10.5,
    leading=15,
    textColor=GRIS_TEXTO,
    alignment=TA_JUSTIFY,
    spaceAfter=8,
)

cuerpo_pequeno = ParagraphStyle(
    "CuerpoPequeno",
    parent=cuerpo,
    fontSize=9.5,
    leading=13,
)

celda_encabezado = ParagraphStyle(
    "CeldaEncabezado",
    parent=cuerpo,
    fontName="Helvetica-Bold",
    fontSize=10,
    leading=13,
    textColor=colors.white,
    alignment=TA_LEFT,
)

celda_contenido = ParagraphStyle(
    "CeldaContenido",
    parent=cuerpo,
    fontSize=9.5,
    leading=13,
    alignment=TA_LEFT,
)

mono = ParagraphStyle(
    "Mono",
    parent=cuerpo,
    fontName="Courier-Bold",
    fontSize=9.5,
    leading=13,
    textColor=colors.HexColor("#8B0000"),
    alignment=TA_LEFT,
)

# ------------------------------------------------------------------
# Funciones de construcción del documento
# ------------------------------------------------------------------


def construir_portada(historia):
    """Portada institucional con datos del SENA, ficha y autor."""
    historia.append(Spacer(1, 5 * cm))

    historia.append(
        Paragraph("SENA - Servicio Nacional de Aprendizaje", titulo_portada)
    )
    historia.append(Spacer(1, 0.4 * cm))
    historia.append(
        Paragraph("Centro de Formación - Tecnología en Desarrollo de Software", subtitulo_portada)
    )
    historia.append(Spacer(1, 1.5 * cm))

    historia.append(
        Paragraph("Manual de Estándares de Codificación del Proyecto", titulo_portada)
    )
    historia.append(Spacer(1, 0.6 * cm))
    historia.append(
        Paragraph(PROYECTO, subtitulo_portada)
    )
    historia.append(Spacer(1, 3.5 * cm))

    datos = [
        ["Ficha SENA:", FICHA_SENA],
        ["Autor:", NOMBRE_AUTOR],
        ["Tecnologías:", TECNOLOGIAS],
        ["Fecha:", datetime.now().strftime("%d/%m/%Y")],
    ]
    tabla_datos = Table(datos, colWidths=[4.5 * cm, 11 * cm])
    tabla_datos.setStyle(
        TableStyle(
            [
                ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
                ("FONTNAME", (1, 0), (1, -1), "Helvetica"),
                ("FONTSIZE", (0, 0), (-1, -1), 12),
                ("TEXTCOLOR", (0, 0), (0, -1), colors.white),
                ("TEXTCOLOR", (1, 0), (1, -1), colors.HexColor("#E8F5E0")),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 8),
                ("ALIGN", (0, 0), (0, -1), "RIGHT"),
                ("ALIGN", (1, 0), (1, -1), "LEFT"),
            ]
        )
    )
    historia.append(tabla_datos)
    historia.append(PageBreak())


def construir_resumen(historia):
    """Sección de introducción y alcance del manual."""
    historia.append(Paragraph("1. Introducción", titulo_seccion))
    historia.append(
        Paragraph(
            "El presente manual establece las normas, convenciones y buenas prácticas "
            "de codificación que deben seguirse en el desarrollo del proyecto "
            f"<b>{PROYECTO}</b>. El objetivo es garantizar la calidad, la legibilidad, "
            "la mantenibilidad y la uniformidad del código fuente, facilitando el trabajo "
            "colaborativo entre los miembros del equipo y la evolución futura del sistema.",
            cuerpo,
        )
    )
    historia.append(
        Paragraph(
            "Este documento se encuentra alojado en la carpeta <b>docs/</b> del repositorio "
            "y debe ser consultado por todo desarrollador que realice cambios en el código.",
            cuerpo,
        )
    )

    historia.append(Paragraph("1.1 Alcance", subtitulo_seccion))
    historia.append(
        Paragraph(
            "El manual aplica a la totalidad del código fuente del proyecto, incluyendo "
            "componentes, servicios, modelos, guardas, rutas, configuración y estilos. "
            "La aplicación es un <b>sistema de gestión empresarial</b> que administra "
            "usuarios, productos, clientes y facturas, construido sobre Angular 22 con "
            "TypeScript, Angular Material y Tailwind CSS.",
            cuerpo,
        )
    )

    historia.append(Paragraph("1.2 Público objetivo", subtitulo_seccion))
    historia.append(
        Paragraph(
            "Desarrolladores frontend, desarrolladores fullstack, revisores de código y "
            "administradores del repositorio que participen en el ciclo de vida del proyecto.",
            cuerpo,
        )
    )
    historia.append(PageBreak())


def construir_nomenclatura(historia):
    """Sección de convenciones de nomenclatura."""
    historia.append(Paragraph("2. Convenciones de Nomenclatura", titulo_seccion))
    historia.append(
        Paragraph(
            "Se adoptan las siguientes convenciones de nomenclatura, adaptadas a la "
            "naturaleza del proyecto (TypeScript / Angular).",
            cuerpo,
        )
    )

    nomenclatura = [
        [
            Paragraph("Elemento", celda_encabezado),
            Paragraph("Convención", celda_encabezado),
            Paragraph("Ejemplo", celda_encabezado),
        ],
        [
            Paragraph("Clases e Interfaces", celda_contenido),
            Paragraph("PascalCase", celda_contenido),
            Paragraph("<font face='Courier'>Usuario, AuthResponse, Credenciales</font>", celda_contenido),
        ],
        [
            Paragraph("Componentes Angular", celda_contenido),
            Paragraph("PascalCase + sufijo .component", celda_contenido),
            Paragraph("<font face='Courier'>LoginComponent, UsuariosComponent, LayoutComponent</font>", celda_contenido),
        ],
        [
            Paragraph("Servicios Angular", celda_contenido),
            Paragraph("PascalCase + sufijo .service", celda_contenido),
            Paragraph("<font face='Courier'>AuthService, UsuariosService, FacturasService</font>", celda_contenido),
        ],
        [
            Paragraph("Modelos / Interfaces", celda_contenido),
            Paragraph("PascalCase + sufijo .model", celda_contenido),
            Paragraph("<font face='Courier'>Usuario, Producto, Cliente, Factura</font>", celda_contenido),
        ],
        [
            Paragraph("Métodos y Variables", celda_contenido),
            Paragraph("camelCase", celda_contenido),
            Paragraph("<font face='Courier'>obtenerUsuarios(), fechaCreacion, esActivo</font>", celda_contenido),
        ],
        [
            Paragraph("Guardas", celda_contenido),
            Paragraph("PascalCase + sufijo .guard", celda_contenido),
            Paragraph("<font face='Courier'>AuthGuard</font>", celda_contenido),
        ],
        [
            Paragraph("Constantes", celda_contenido),
            Paragraph("UPPER_SNAKE_CASE", celda_contenido),
            Paragraph("<font face='Courier'>API_URL, MAX_INTENTOS</font>", celda_contenido),
        ],
        [
            Paragraph("Base de datos (campos)", celda_contenido),
            Paragraph("snake_case", celda_contenido),
            Paragraph("<font face='Courier'>fecha_creacion, numero_documento</font>", celda_contenido),
        ],
        [
            Paragraph("Archivos y carpetas", celda_contenido),
            Paragraph("kebab-case", celda_contenido),
            Paragraph("<font face='Courier'>login.component.ts, usuarios.service.ts</font>", celda_contenido),
        ],
    ]

    tabla = Table(nomenclatura, colWidths=[4.5 * cm, 5 * cm, 6.5 * cm], repeatRows=1)
    tabla.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), VERDE_SENA),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#BBBBBB")),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, GRIS_CLARO]),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )
    historia.append(tabla)
    historia.append(Spacer(1, 0.4 * cm))
    historia.append(PageBreak())


def construir_estructura(historia):
    """Sección de estructura de directorios."""
    historia.append(Paragraph("3. Estructura de Directorios", titulo_seccion))
    historia.append(
        Paragraph(
            "El proyecto sigue la estructura recomendada por Angular para una aplicación "
            "modular y escalable. La carpeta <b>docs/</b> aloja la documentación técnica.",
            cuerpo,
        )
    )

    estructura = """ejemplo01/
|-- .angular/                    # Configuracion y cache de Angular CLI
|-- .gitignore                   # Archivos ignorados por Git
|-- .vscode/                     # Configuracion del editor
|-- angular.json                 # Configuracion del workspace Angular
|-- docs/                        # Documentacion del proyecto
|   `-- Estandares_Codificacion.pdf   # Este manual
|-- public/                      # Archivos estaticos publicos
|-- src/
|   |-- app/
|   |   |-- app.config.ts        # Configuracion de la aplicacion
|   |   |-- app.routes.ts        # Definicion de rutas
|   |   |-- app.ts               # Componente raiz
|   |   |-- components/
|   |   |   |-- login/           # Componente de inicio de sesion
|   |   |   |-- dashboard/       # Panel principal
|   |   |   |-- usuarios/        # Gestion de usuarios
|   |   |   |-- productos/       # Gestion de productos
|   |   |   |-- clientes/        # Gestion de clientes
|   |   |   |-- facturas/        # Gestion de facturas
|   |   |   `-- layout/          # Layout general de la app
|   |   |-- guards/              # Guardas de autenticacion
|   |   |   `-- auth.guard.ts    # Proteccion de rutas
|   |   |-- models/              # Modelos de datos
|   |   |   |-- usuario.model.ts
|   |   |   |-- producto.model.ts
|   |   |   |-- cliente.model.ts
|   |   |   `-- factura.model.ts
|   |   `-- services/            # Servicios de negocio
|   |       |-- auth.service.ts
|   |       |-- usuarios.service.ts
|   |       |-- productos.service.ts
|   |       |-- clientes.service.ts
|   |       `-- facturas.service.ts
|   |-- index.html               # Pagina principal
|   |-- main.ts                  # Punto de entrada
|   `-- styles.css               # Estilos globales (Tailwind)
|-- package.json                 # Dependencias y scripts
|-- tsconfig.app.json            # Configuracion TS de la app
|-- tsconfig.json                # Configuracion TS base
`-- tsconfig.spec.json           # Configuracion TS de pruebas"""

    estilo_arbol = ParagraphStyle(
        "Arbol",
        parent=mono,
        fontName="Courier",
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor("#1A1A1A"),
        alignment=TA_LEFT,
    )
    historia.append(Paragraph(estructura, estilo_arbol))
    historia.append(PageBreak())


def construir_git(historia):
    """Sección de buenas prácticas de control de versiones con Git."""
    historia.append(Paragraph("4. Buenas Prácticas de Control de Versiones (Git)", titulo_seccion))
    historia.append(
        Paragraph(
            "El proyecto se gestiona con Git y se aloja en GitHub. Se siguen las "
            "siguientes buenas prácticas para mantener un historial limpio y trazable.",
            cuerpo,
        )
    )

    historia.append(Paragraph("4.1 Convención de commits", subtitulo_seccion))
    historia.append(
        Paragraph(
            "Cada commit debe tener un mensaje descriptivo que comience con un prefijo "
            "estándar que indique el tipo de cambio realizado. Formato recomendado:",
            cuerpo,
        )
    )
    historia.append(
        Paragraph(
            "<font face='Courier'>[tipo]: [descripción resumida en presente]</font>",
            mono,
        )
    )

    prefijos = [
        [
            Paragraph("Prefijo", celda_encabezado),
            Paragraph("Uso", celda_encabezado),
            Paragraph("Ejemplo", celda_encabezado),
        ],
        [
            Paragraph("feat:", celda_contenido),
            Paragraph("Nueva funcionalidad", celda_contenido),
            Paragraph("<font face='Courier'>feat: agregar módulo de facturación</font>", celda_contenido),
        ],
        [
            Paragraph("fix:", celda_contenido),
            Paragraph("Corrección de errores", celda_contenido),
            Paragraph("<font face='Courier'>fix: corregir validación de login</font>", celda_contenido),
        ],
        [
            Paragraph("docs:", celda_contenido),
            Paragraph("Cambios en documentación", celda_contenido),
            Paragraph("<font face='Courier'>docs: actualizar manual de usuario</font>", celda_contenido),
        ],
        [
            Paragraph("refactor:", celda_contenido),
            Paragraph("Mejora de código sin cambiar comportamiento", celda_contenido),
            Paragraph("<font face='Courier'>refactor: simplificar servicio de usuarios</font>", celda_contenido),
        ],
        [
            Paragraph("style:", celda_contenido),
            Paragraph("Cambios de formato sin afectar lógica", celda_contenido),
            Paragraph("<font face='Courier'>style: aplicar formato prettier</font>", celda_contenido),
        ],
        [
            Paragraph("test:", celda_contenido),
            Paragraph("Añadir o modificar pruebas", celda_contenido),
            Paragraph("<font face='Courier'>test: agregar pruebas de auth</font>", celda_contenido),
        ],
        [
            Paragraph("chore:", celda_contenido),
            Paragraph("Tareas de mantenimiento", celda_contenido),
            Paragraph("<font face='Courier'>chore: actualizar dependencias</font>", celda_contenido),
        ],
    ]

    tabla_prefijos = Table(prefijos, colWidths=[3 * cm, 6 * cm, 7 * cm], repeatRows=1)
    tabla_prefijos.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), VERDE_SENA),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#BBBBBB")),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, GRIS_CLARO]),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )
    historia.append(tabla_prefijos)
    historia.append(Spacer(1, 0.5 * cm))

    historia.append(Paragraph("4.2 Flujo de trabajo recomendado", subtitulo_seccion))
    pasos = [
        "1. Crear una rama descriptiva por cada funcionalidad (ej. <font face='Courier'>feature/login</font>).",
        "2. Realizar commits pequeños y atómicos con mensajes claros.",
        "3. Antes de cada commit, revisar los cambios con <font face='Courier'>git status</font> y <font face='Courier'>git diff</font>.",
        "4. Mantener el código formateado (Prettier) y sin errores de lint.",
        "5. Integrar los cambios a la rama principal (main) mediante pull request.",
    ]
    for paso in pasos:
        historia.append(Paragraph(paso, cuerpo_pequeno))
    historia.append(Spacer(1, 0.3 * cm))

    historia.append(Paragraph("4.3 Ejemplo de flujo de trabajo", subtitulo_seccion))
    ejemplo = """# 1. Verificar estado del repositorio
git status

# 2. Añadir los archivos modificados
git add docs/Estandares_Codificacion.pdf

# 3. Crear un commit con mensaje descriptivo
git commit -m "docs: agregar manual de estandares de codificacion en carpeta docs"

# 4. Subir los cambios a la rama principal
git push origin main"""
    historia.append(Paragraph(ejemplo, mono))
    historia.append(PageBreak())


def construir_herramientas(historia):
    """Sección final de herramientas y calidad de código."""
    historia.append(Paragraph("5. Herramientas y Calidad de Código", titulo_seccion))
    herramientas = [
        [
            Paragraph("Herramienta", celda_encabezado),
            Paragraph("Propósito", celda_encabezado),
        ],
        [
            Paragraph("TypeScript", celda_contenido),
            Paragraph("Lenguaje principal con tipado estático.", celda_contenido),
        ],
        [
            Paragraph("Angular CLI", celda_contenido),
            Paragraph("Generación de componentes, servicios y builds.", celda_contenido),
        ],
        [
            Paragraph("Angular Material", celda_contenido),
            Paragraph("Componentes de interfaz reutilizables.", celda_contenido),
        ],
        [
            Paragraph("Tailwind CSS", celda_contenido),
            Paragraph("Estilos utilitarios y diseño responsive.", celda_contenido),
        ],
        [
            Paragraph("Prettier", celda_contenido),
            Paragraph("Formateo automático del código.", celda_contenido),
        ],
        [
            Paragraph("Vitest", celda_contenido),
            Paragraph("Pruebas unitarias de componentes y servicios.", celda_contenido),
        ],
        [
            Paragraph("Git / GitHub", celda_contenido),
            Paragraph("Control de versiones y alojamiento del repositorio.", celda_contenido),
        ],
    ]

    tabla_herramientas = Table(herramientas, colWidths=[5 * cm, 11 * cm], repeatRows=1)
    tabla_herramientas.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), VERDE_SENA),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#BBBBBB")),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, GRIS_CLARO]),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )
    historia.append(tabla_herramientas)
    historia.append(Spacer(1, 0.6 * cm))

    historia.append(
        Paragraph(
            "Este manual fue generado de forma automatizada mediante un script de Python "
            "(reportlab) y se encuentra versionado en la carpeta <b>docs/</b> del repositorio "
            f"<b>{PROYECTO}</b>.",
            cuerpo,
        )
    )


# ------------------------------------------------------------------
# Construcción del documento con encabezado y pie de página
# ------------------------------------------------------------------

def portada_fondo(canvas, doc):
    """Dibuja el fondo verde institucional en la portada."""
    canvas.saveState()
    canvas.setFillColor(VERDE_SENA)
    canvas.rect(0, 0, doc.pagesize[0], doc.pagesize[1], stroke=0, fill=1)
    canvas.restoreState()


def encabezado_pie(canvas, doc):
    """Dibuja encabezado y número de página en cada página (excepto portada)."""
    if doc.page == 1:
        return
    canvas.saveState()
    # Encabezado
    canvas.setFillColor(VERDE_SENA)
    canvas.rect(0, doc.pagesize[1] - 1.2 * cm, doc.pagesize[0], 1.2 * cm, stroke=0, fill=1)
    canvas.setFillColor(colors.white)
    canvas.setFont("Helvetica-Bold", 9)
    canvas.drawString(1.5 * cm, doc.pagesize[1] - 0.8 * cm, "Manual de Estándares de Codificación")
    canvas.drawRightString(doc.pagesize[0] - 1.5 * cm, doc.pagesize[1] - 0.8 * cm, PROYECTO)
    # Pie de página
    canvas.setFillColor(VERDE_OSCURO)
    canvas.rect(0, 0, doc.pagesize[0], 0.9 * cm, stroke=0, fill=1)
    canvas.setFillColor(colors.white)
    canvas.setFont("Helvetica", 8.5)
    canvas.drawString(1.5 * cm, 0.35 * cm, f"Ficha SENA {FICHA_SENA} - {NOMBRE_AUTOR}")
    canvas.drawRightString(doc.pagesize[0] - 1.5 * cm, 0.35 * cm, f"Página {doc.page}")
    canvas.restoreState()


def generar_pdf():
    """Genera el documento PDF completo."""
    os.makedirs(DOCS_DIR, exist_ok=True)

    doc = BaseDocTemplate(
        OUTPUT_PDF,
        pagesize=A4,
        leftMargin=2 * cm,
        rightMargin=2 * cm,
        topMargin=2.2 * cm,
        bottomMargin=1.6 * cm,
        title="Manual de Estándares de Codificación del Proyecto",
        author=NOMBRE_AUTOR,
        subject="Estandares de codificacion - " + PROYECTO,
    )

    marco = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="marco")
    portada_template = PageTemplate(id="portada", frames=[marco], onPage=portada_fondo)
    pagina_template = PageTemplate(id="pagina", frames=[marco], onPage=encabezado_pie)
    doc.addPageTemplates([portada_template, pagina_template])
    doc._firstPageTemplateIndex = 0

    historia = []
    construir_portada(historia)
    construir_resumen(historia)
    construir_nomenclatura(historia)
    construir_estructura(historia)
    construir_git(historia)
    construir_herramientas(historia)

    doc.build(historia)
    print(f"PDF generado correctamente en: {OUTPUT_PDF}")
    return OUTPUT_PDF


if __name__ == "__main__":
    generar_pdf()