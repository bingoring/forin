// Package contentfile loads authored content from the filesystem (git-versioned
// YAML) into a content.Bundle. This is one source adapter; a future CMS could be
// another, producing the same Bundle for the same DB.
package contentfile

import (
	"fmt"
	"os"
	"path/filepath"

	"gopkg.in/yaml.v3"

	"github.com/bingoring/forin/server/internal/domain/content"
)

// Load reads <dir>/manifest.yaml and <dir>/<profession>/<type>/*.yaml into a Bundle.
// The profession is taken from the directory name and filled into each entity.
func Load(dir string) (*content.Bundle, error) {
	b := &content.Bundle{}

	if err := readYAML(filepath.Join(dir, "manifest.yaml"), &b.Manifest); err != nil {
		return nil, fmt.Errorf("manifest: %w", err)
	}

	profs, err := os.ReadDir(dir)
	if err != nil {
		return nil, err
	}
	for _, pe := range profs {
		if !pe.IsDir() {
			continue
		}
		prof := pe.Name()
		pdir := filepath.Join(dir, prof)
		if err := loadType(pdir, "departments", prof, func(d content.Department) { b.Departments = append(b.Departments, d) }); err != nil {
			return nil, err
		}
		if err := loadType(pdir, "events", prof, func(e content.Event) { b.Events = append(b.Events, e) }); err != nil {
			return nil, err
		}
		if err := loadType(pdir, "scenarios", prof, func(s content.Scenario) { b.Scenarios = append(b.Scenarios, s) }); err != nil {
			return nil, err
		}
		if err := loadType(pdir, "quizzes", prof, func(q content.Quiz) { b.Quizzes = append(b.Quizzes, q) }); err != nil {
			return nil, err
		}
		if err := loadType(pdir, "phrases", prof, func(p content.Phrase) { b.Phrases = append(b.Phrases, p) }); err != nil {
			return nil, err
		}
	}
	return b, nil
}

// loadType reads every *.yaml in <pdir>/<typeDir> as a T, defaults its profession, and collects it.
func loadType[T any](pdir, typeDir, prof string, collect func(T)) error {
	glob := filepath.Join(pdir, typeDir, "*.yaml")
	files, err := filepath.Glob(glob)
	if err != nil {
		return err
	}
	for _, f := range files {
		var item T
		if err := readYAML(f, &item); err != nil {
			return fmt.Errorf("%s: %w", f, err)
		}
		setProfessionIfEmpty(&item, prof)
		collect(item)
	}
	return nil
}

func readYAML(path string, dst any) error {
	data, err := os.ReadFile(path)
	if err != nil {
		return err
	}
	return yaml.Unmarshal(data, dst)
}

// setProfessionIfEmpty fills the Profession field from the directory when omitted.
func setProfessionIfEmpty(item any, prof string) {
	switch v := item.(type) {
	case *content.Department:
		if v.Profession == "" {
			v.Profession = prof
		}
	case *content.Event:
		if v.Profession == "" {
			v.Profession = prof
		}
	case *content.Scenario:
		if v.Profession == "" {
			v.Profession = prof
		}
	case *content.Quiz:
		if v.Profession == "" {
			v.Profession = prof
		}
	case *content.Phrase:
		if v.Profession == "" {
			v.Profession = prof
		}
	}
}
