import beautyIcon from '../assets/icons/experiences/beauty.svg'
import careIcon from '../assets/icons/experiences/care.svg'
import cookingIcon from '../assets/icons/experiences/cooking.svg'
import drivingIcon from '../assets/icons/experiences/driving.svg'
import officeIcon from '../assets/icons/experiences/office.svg'
import otherIcon from '../assets/icons/experiences/other.svg'
import safetyIcon from '../assets/icons/experiences/safety.svg'
import technicalIcon from '../assets/icons/experiences/technical.svg'
import type { ExperienceCategoryId } from '../types/flow'

interface ExperienceCategory {
  id: ExperienceCategoryId
  label: string
  icon: string
  iconWidth: number
  iconHeight: number
}

export const EXPERIENCE_CATEGORIES = [
  {
    id: 'driving-transport',
    label: '운전·운송',
    icon: drivingIcon,
    iconWidth: 48.75,
    iconHeight: 33.75,
  },
  {
    id: 'cooking-food',
    label: '조리·음식',
    icon: cookingIcon,
    iconWidth: 40.7812,
    iconHeight: 48.75,
  },
  {
    id: 'facility-safety',
    label: '시설·안전',
    icon: safetyIcon,
    iconWidth: 43.125,
    iconHeight: 50.625,
  },
  {
    id: 'office-accounting',
    label: '사무·회계',
    icon: officeIcon,
    iconWidth: 41.25,
    iconHeight: 50.625,
  },
  {
    id: 'care-welfare',
    label: '돌봄·복지',
    icon: careIcon,
    iconWidth: 45,
    iconHeight: 44.0625,
  },
  {
    id: 'technical-skills',
    label: '기술·기능',
    icon: technicalIcon,
    iconWidth: 50.041,
    iconHeight: 50.041,
  },
  {
    id: 'beauty-service',
    label: '미용·서비스',
    icon: beautyIcon,
    iconWidth: 44.0627,
    iconHeight: 43.125,
  },
  {
    id: 'other',
    label: '기타',
    icon: otherIcon,
    iconWidth: 45,
    iconHeight: 45,
  },
] as const satisfies readonly ExperienceCategory[]
