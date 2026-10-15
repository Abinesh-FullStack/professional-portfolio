import { ArrowUpRight, FileText } from 'lucide-react'
import { profile } from '../data/profile'
import { GithubIcon, LinkedinIcon } from '../components/Icon'
import Button from '../components/Button'
import RevealText from '../components/RevealText'
import ScratchCard from '../components/ScratchCard'

export default function Contact() {
  const { email, links, contact } = profile

  const rows = [
    { label: 'LinkedIn', value: 'in/abinesh-v', href: links.linkedin, Icon: LinkedinIcon },
    { label: 'GitHub', value: 'Abinesh-FullStack', href: links.github, Icon: GithubIcon },
    links.resume && { label: 'Resume', value: 'Download PDF', href: links.resume, Icon: FileText },
  ].filter(Boolean)

  return (
    <section id="contact" className="section contact" aria-labelledby="contact-title">
      <div className="container">
        <p className="eyebrow" data-reveal="fade">
          <span className="eyebrow__index">08</span>
          <span className="eyebrow__rule" data-reveal="line" aria-hidden="true" />
          <span>Contact</span>
        </p>
        <RevealText
          as="h2"
          id="contact-title"
          className="contact__title"
          parts={[`${contact.headline}\n`, { accent: contact.headlineAccent }]}
        />

        <div className="contact__grid">
          <div className="contact__left">
            <p className="contact__text" data-reveal>
              {contact.text}
            </p>
            <div className="contact__ctas" data-reveal>
              {email ? (
                <Button href={`mailto:${email}?subject=${encodeURIComponent('Hello Abinesh')}`} magnetic>
                  Send an email
                </Button>
              ) : (
                <Button href={links.linkedin} magnetic>
                  Message me on LinkedIn
                </Button>
              )}
            </div>

            <ul className="contact__rows">
              {rows.map(({ label, value, href, Icon }) => {
                const external = /^https?:/.test(href)
                return (
                  <li key={label} data-reveal="left">
                    <a href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : { download: '' })}>
                      <span className="contact__icon"><Icon size={18} /></span>
                      <span className="contact__label mono">{label}</span>
                      <span className="contact__value">{value}</span>
                      <ArrowUpRight className="contact__arrow" size={20} strokeWidth={1.5} aria-hidden="true" />
                      {external && <span className="sr-only"> (opens in a new tab)</span>}
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>

          <ScratchCard />
        </div>
      </div>
    </section>
  )
}
