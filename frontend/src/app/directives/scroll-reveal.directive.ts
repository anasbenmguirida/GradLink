import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appScrollReveal]',
  standalone: true,
})
export class ScrollRevealDirective implements OnInit {
  @Input() animationClass: string = 'fade-in'; // Classe CSS à appliquer

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    // Vérifiez si IntersectionObserver est disponible
    if (typeof IntersectionObserver === 'undefined') {
      // Appliquer directement la classe si IntersectionObserver n'est pas disponible
      this.el.nativeElement.classList.add(this.animationClass);
      return;
    }

    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.el.nativeElement.classList.add(this.animationClass);
            observer.unobserve(this.el.nativeElement);
          }
        });
      },
      {
        threshold: 0.1, // Déclenche l'animation à 10% de visibilité
      }
    );

    observer.observe(this.el.nativeElement);
  }
}
