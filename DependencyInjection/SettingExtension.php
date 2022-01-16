<?php

/**
 * @copyright EveryWorkflow. All rights reserved.
 */

declare(strict_types=1);

namespace EveryWorkflow\SettingBundle\DependencyInjection;

use EveryWorkflow\SettingBundle\Model\SettingConfigProvider;
use Symfony\Component\Config\FileLocator;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Extension\PrependExtensionInterface;
use Symfony\Component\DependencyInjection\Loader\PhpFileLoader;
use Symfony\Component\DependencyInjection\Loader\YamlFileLoader;
use Symfony\Component\HttpKernel\DependencyInjection\ConfigurableExtension;

class SettingExtension extends ConfigurableExtension implements PrependExtensionInterface
{
    protected function loadInternal(array $mergedConfig, ContainerBuilder $container): void
    {
        $loader = new PhpFileLoader($container, new FileLocator(__DIR__ . '/../Resources/config'));
        $loader->load('services.php');

        $definition = $container->getDefinition(SettingConfigProvider::class);
        $definition->addArgument($mergedConfig);
    }

    public function prepend(ContainerBuilder $container): void
    {
        $bundles = $container->getParameter('kernel.bundles');
        $ymlLoader = new YamlFileLoader($container, new FileLocator(__DIR__ . '/../Resources/config'));
        if (isset($bundles['EveryWorkflowAuthBundle'])) {
            $ymlLoader->load('auth.yaml');
        }
        if (isset($bundles['EveryWorkflowAdminPanelBundle'])) {
            $ymlLoader->load('admin_panel.yaml');
        }
        $ymlLoader->load('setting.yaml');
    }
}
