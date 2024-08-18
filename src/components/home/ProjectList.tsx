import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/server/db'
import { project as Project } from '@prisma/client'

interface ProjectProps {
  project: Project
}

const ProjectCard = ({ project }: ProjectProps) => {
  const Basic = (
    <React.Fragment>
      <div className="flex items-center gap-2">
        <div className="text-2xl">
          {project.link ? (
            <Link className="hover:underline" target="_blank" href={project.link}>
              {project.name}
            </Link>
          ) : (
            project.name
          )}
        </div>
        <div className="select-none rounded bg-blue-300 px-1 text-sm">{project.role}</div>
      </div>
      <div className="mt-4 text-sm">{project.desc}</div>
    </React.Fragment>
  )

  return (
    <div className="flex flex-col rounded-xl border p-4">
      <div className={'mb-auto'}>
        {project.image ? (
          <div className="flex items-start">
            <div className="mr-5 flex-1">{Basic}</div>
            <Image draggable={false} width={68} height={68} src={project.image} alt="" />
          </div>
        ) : (
          Basic
        )}
      </div>
      <div className="mt-4 flex gap-2">
        {project.tech
          .replaceAll(/[\[\]]/g, '')
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean)
          .map((tech) => (
            <div key={tech} className="rounded bg-emerald-300 px-2 dark:bg-emerald-900">
              {tech}
            </div>
          ))}
      </div>
    </div>
  )
}

const ProjectList = async () => {
  const list = await prisma.project.findMany()
  return (
    <div className="mt-8">
      {list.length === 0 ? (
        <div>暂无项目</div>
      ) : (
        <div className="grid grid-cols-2 gap-4 pt-4">
          {list.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  )
}

export default ProjectList
