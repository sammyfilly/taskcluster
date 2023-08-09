import logging
from pathlib import Path

from taskgraph.util.templates import merge


logger = logging.getLogger(__name__)


def services_and_libraries_loader(kind, path, config, parameters, loaded_tasks):
    for package in [d for d in Path(config["workspace"]).iterdir() if d.is_dir()]:
        task = merge(
            config.get("task-defaults", {}),
            {
                "name": package.name,
                "description": f"package tests for {package.name}",
                "run": {
                    "command": f"""yarn --frozen-lockfile && ./db/test-setup.sh && yarn workspace taskcluster-{config.get("prefix", '')}{package.name} coverage:report"""
                },
            },
            config.get("task-overrides", {}).get(package.name, {}),
        )
        logger.debug(f"Generating tasks for {kind} {package.name}")
        yield task
